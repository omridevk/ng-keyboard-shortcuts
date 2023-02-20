import { Inject, Injectable, OnDestroy } from "@angular/core";
import {
    _INVERTED_SHIFT_MAP,
    _KEYCODE_MAP,
    _MAP,
    _SHIFT_MAP,
    _SPECIAL_CASES,
    modifiers
} from "./keys";
import {
    BehaviorSubject,
    fromEvent,
    Observable,
    of,
    Subject,
    Subscription,
    throwError,
    timer
} from "rxjs";
import {
    AllowIn,
    ParsedShortcut,
    ShortcutEventOutput,
    ShortcutInput
} from "./ng-keyboard-shortcuts.interfaces";
import {
    catchError,
    filter,
    first,
    map,
    repeat,
    scan,
    switchMap,
    takeUntil,
    tap,
    throttle
} from "rxjs/operators";
import { allPass, any, difference, identity, isFunction, isNill, maxArrayProp } from "./utils";
import { DOCUMENT } from "@angular/common";

/**
 * @ignore
 * @type {number}
 */
let guid = 0;

@Injectable({
    providedIn: "root"
})
export class KeyboardShortcutsService implements OnDestroy {
    /**
     * Parsed shortcuts
     * for each key create a predicate function
     */
    private _shortcuts: ParsedShortcut[] = [];

    private _sequences: ParsedShortcut[] = [];

    /**
     * Throttle the keypress event.
     */
    private throttleTime = 0;

    private _pressed = new Subject<ShortcutEventOutput>();

    /**
     * Streams of pressed events, can be used instead or with a command.
     */
    public pressed$ = this._pressed.asObservable();

    /**
     * Disable all keyboard shortcuts
     */
    private disabled = false;
    /**
     * @ignore
     * 2000 ms window to allow between key sequences otherwise
     * the sequence will reset.
     */
    private static readonly TIMEOUT_SEQUENCE = 1000;

    private _shortcutsSub = new BehaviorSubject<ParsedShortcut[]>([]);
    public shortcuts$ = this._shortcutsSub
        .pipe(filter((shortcuts) => !!shortcuts.length));

    private _ignored = [AllowIn.Input, AllowIn.Textarea, AllowIn.Select, AllowIn.ContentEditable];

    /**
     * @ignore
     * @param shortcut
     */
    private isAllowed = (shortcut: ParsedShortcut) => {
        const target = shortcut.event.target as HTMLElement;
        const isContentEditable = !!target.getAttribute("contenteditable");
        const nodeName = isContentEditable ? AllowIn.ContentEditable : target.nodeName;
        if (target === shortcut.target) {
            return true;
        }
        // if (shortcut.allowIn.includes(AllowIn.ContentEditable)) {
        //     return !!target.getAttribute("contenteditable");
        // }
        if (shortcut.allowIn.length) {
            return !difference(this._ignored, shortcut.allowIn).includes(nodeName);
        }
        if (isContentEditable) {
            return false;
        }
        return !this._ignored.includes(target.nodeName as AllowIn);
    };

    /**
     * @ignore
     * @param event
     */
    private mapEvent = (event) => {
        return this._shortcuts
            .filter((shortcut) => !shortcut.isSequence)
            .map((shortcut) =>
                Object.assign({}, shortcut, {
                    predicates: any(
                        identity,
                        shortcut.predicates.map((predicates: any) => allPass(predicates)(event))
                    ),
                    event: event
                })
            )
            .filter((shortcut) => shortcut.predicates)
            .reduce((acc, shortcut) => (acc.priority > shortcut.priority ? acc : shortcut), {
                priority: 0
            } as ParsedShortcut);
    };

    /**
     * @ignore
     * Subscription for on destroy.
     */
    private readonly subscriptions: Subscription[] = [];

    private keydown$: Observable<KeyboardEvent> = fromEvent(this.document, "keydown");
    /**
     * fixes for firefox prevent default
     * on click event on button focus:
     * see issue:
     * keeping this here for now, but it is commented out
     * Firefox reference bug:
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1487102
     * and my repo:
     *
     * https://github.com/omridevk/ng-keyboard-shortcuts/issues/35
     */
    private ignore$ = this.pressed$.pipe(
        filter((e) => e.event.defaultPrevented),
        switchMap(() => this.clicks$.pipe(first())),
        tap((e: any) => {
            e.preventDefault();
            e.stopPropagation();
        }),
        repeat()
    );
    /**
     * @ignore
     */
    private clicks$ = fromEvent(this.document, "click", { capture: true });

    private keyup$ = fromEvent(this.document, "keyup");

    /**
     * @ignore
     */
    private keydownCombo$ = this.keydown$.pipe(
        filter((_) => !this.disabled),
        map(this.mapEvent),
        filter(
            (shortcut: ParsedShortcut) =>
                !shortcut.target || shortcut.event.target === shortcut.target
        ),
        filter((shortcut: ParsedShortcut) => isFunction(shortcut.command)),
        filter((shortcut) => this.isAllowed(shortcut)),
        tap((shortcut) => {
            if (!shortcut.preventDefault) {
                return;
            }
            shortcut.event.preventDefault();
            shortcut.event.stopPropagation();
        }),
        throttle((shortcut) => timer(shortcut.throttleTime)),
        tap((shortcut) => shortcut.command({ event: shortcut.event, key: shortcut.key })),
        tap((shortcut) => this._pressed.next({ event: shortcut.event, key: shortcut.key })),
        takeUntil(this.keyup$),
        repeat(),
        catchError((error) => throwError(() => error))
    );

    /**
     * @ignore
     */
    private timer$ = new Subject();
    /**
     * @ignore
     */
    private resetCounter$ = this.timer$
        .asObservable()
        .pipe(switchMap(() => timer(KeyboardShortcutsService.TIMEOUT_SEQUENCE)));

    private keydownSequence$ = this.keydown$.pipe(
        map((event) => ({
            event,
            sequences: this._sequences
        })),
        scan(
            (acc: { events: any[]; command?: any; sequences: any[] }, arg: any) => {
                const { event } = arg;
                const currentLength = acc.events.length;
                const sequences = currentLength ? acc.sequences : arg.sequences;
                const [characters] = this.characterFromEvent(event);
                const allChars = Array.isArray(characters)
                    ? [...characters, event.key]
                    : [characters, event.key];
                const result = sequences
                    .map((sequence) => {
                        const sequences = sequence.sequence.filter((seque) =>
                            allChars.some(
                                (key) =>
                                    (_SPECIAL_CASES[seque[currentLength]] ||
                                        seque[currentLength]) === key
                            )
                        );
                        const partialMatch = sequences.length > 0;
                        if (sequence.fullMatch) {
                            return sequence;
                        }
                        return {
                            ...sequence,
                            sequence: sequences,
                            partialMatch,
                            event: event,
                            fullMatch:
                                partialMatch &&
                                this.isFullMatch({ command: sequence, events: acc.events })
                        };
                    })
                    .filter((sequences) => sequences.partialMatch || sequences.fullMatch);

                const [match] = result;
                if (!match || this.modifiersOn(event)) {
                    return { events: [], sequences: this._sequences };
                }
                /*
                 * handle case of "?" sequence and "? a" sequence
                 * need to determine which one to trigger.
                 * if both match, we pick the longer one (? a) in this case.
                 */
                const guess = maxArrayProp("priority", result);
                if (result.length > 1 && guess.fullMatch) {
                    return { events: [], command: guess, sequences: this._sequences };
                }
                if (result.length > 1) {
                    return {
                        events: [...acc.events, event],
                        command: result,
                        sequences: result
                    };
                }
                if (match.fullMatch) {
                    return { events: [], command: match, sequences: this._sequences };
                }
                return {
                    events: [...acc.events, event],
                    command: result,
                    sequences: result
                };
            },
            { events: [], sequences: [] }
        ),
        switchMap(({ command }) => {
            if (Array.isArray(command)) {
                /*
                 * Add a timer to handle the case where for example:
                 * a sequence "?" is registered and "? a" is registered as well
                 * if the user does not hit any key for 500ms, the single sequence will trigger
                 * if any keydown event occur, this timer will reset, given a chance to complete
                 * the full sequence (? a) in this case.
                 * This delay only occurs when single key sequence is the beginning of another sequence.
                 */
                return timer(500).pipe(
                    map(() => ({
                        command: command.filter((command) => command.fullMatch)[0]
                    }))
                );
            }
            return of({ command });
        }),
        takeUntil(this.pressed$),
        filter(({ command }) => command && command.fullMatch),
        map(({ command }) => command),
        filter((shortcut: ParsedShortcut) => isFunction(shortcut.command)),
        filter(
            (shortcut: ParsedShortcut) =>
                !shortcut.target || shortcut.event.target === shortcut.target
        ),
        filter(this.isAllowed),
        tap((shortcut) => !shortcut.preventDefault || shortcut.event.preventDefault()),
        throttle((shortcut) => timer(shortcut.throttleTime)),
        tap((shortcut) => shortcut.command({ event: shortcut.event, key: shortcut.key })),
        tap((shortcut) => this._pressed.next({ event: shortcut.event, key: shortcut.key })),
        takeUntil(this.resetCounter$),
        repeat()
    );

    /**
     * @ignore
     * @param command
     * @param events
     */
    private isFullMatch({ command, events }) {
        if (!command) {
            return false;
        }
        return command.sequence.some((sequence) => {
            return sequence.length === events.length + 1;
        });
    }

    /**
     * @ignore
     */
    private get shortcuts() {
        return this._shortcuts;
    }

    /**
     * @ignore
     */
    constructor(@Inject(DOCUMENT) private document: any) {
        this.subscriptions.push(
            this.keydownSequence$.subscribe(),
            this.keydownCombo$.subscribe()
            // this.ignore$.subscribe()
        );
    }

    /**
     * @ignore
     * @param event
     */
    private _characterFromEvent(event): [string, boolean] {
        if (typeof event.which !== "number") {
            event.which = event.keyCode;
        }
        if (_SPECIAL_CASES[event.which]) {
            return [_SPECIAL_CASES[event.which], event.shiftKey];
        }
        if (_MAP[event.which]) {
            // for non keypress events the special maps are needed
            return [_MAP[event.which], event.shiftKey];
        }

        if (_KEYCODE_MAP[event.which]) {
            return [_KEYCODE_MAP[event.which], event.shiftKey];
        }
        // in case event key is lower case but registered key is upper case
        // return it in the lower case
        if (String.fromCharCode(event.which).toLowerCase() !== event.key) {
            return [String.fromCharCode(event.which).toLowerCase(), event.shiftKey];
        }
        return [event.key, event.shiftKey];
    }

    private characterFromEvent(event) {
        const [key, shiftKey] = this._characterFromEvent(event);
        if (shiftKey && _SHIFT_MAP[key]) {
            return [_SHIFT_MAP[key], shiftKey];
        }
        return [key, shiftKey];
    }

    /**
     * @ignore
     * Remove subscription.
     */
    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    /**
     * @ignore
     * @param shortcuts
     */
    private isSequence(shortcuts: string[]): boolean {
        return !shortcuts.some((shortcut) => shortcut.includes("+") || shortcut.length === 1);
    }

    /**
     * Add new shortcut/s
     */
    public add(shortcuts: ShortcutInput[] | ShortcutInput): string[] {
        shortcuts = Array.isArray(shortcuts) ? shortcuts : [shortcuts];
        const commands = this.parseCommand(shortcuts);
        commands.forEach((command) => {
            if (command.isSequence) {
                this._sequences.push(command);
                return;
            }
            this._shortcuts.push(command);
        });
        setTimeout(() => {
            this._shortcutsSub.next([...this._shortcuts, ...this._sequences]);
        });
        return commands.map((command) => command.id);
    }

    /**
     * Remove a command based on key or array of keys.
     * can be used for cleanup.
     * @returns
     * @param ids
     */
    public remove(ids: string | string[]): KeyboardShortcutsService {
        ids = Array.isArray(ids) ? ids : [ids];
        this._shortcuts = this._shortcuts.filter((shortcut) => !ids.includes(shortcut.id));
        this._sequences = this._sequences.filter((shortcut) => !ids.includes(shortcut.id));
        setTimeout(() => {
            this._shortcutsSub.next([...this._shortcuts, ...this._sequences]);
        });
        return this;
    }

    /**
     * Returns an observable of keyboard shortcut filtered by a specific key.
     * @param key - the key to filter the observable by.
     */
    public select(key: string): Observable<ShortcutEventOutput> {
        return this.pressed$.pipe(
            filter(({ event, key: eventKeys }) => {
                eventKeys = Array.isArray(eventKeys) ? eventKeys : [eventKeys];
                return !!eventKeys.find((eventKey) => eventKey === key);
            })
        );
    }

    /**
     * @ignore
     * transforms a shortcut to:
     * a predicate function
     */
    private getKeys = (keys: string[]) => {
        return keys
            .map((key) => key.trim())
            .filter((key) => key !== "+")
            .map((key) => {
                // for modifiers like control key
                // look for event['ctrlKey']
                // otherwise use the keyCode
                key = _SPECIAL_CASES[key] || key;
                // eslint-disable-next-line no-prototype-builtins
                if (modifiers.hasOwnProperty(key)) {
                    return (event) => {
                        return !!event[modifiers[key]];
                    };
                }

                return (event: KeyboardEvent) => {
                    const isUpper = key === key.toUpperCase();
                    const isNonAlpha = /[^a-zA-Z\d\s:]/.test(key);
                    const inShiftMap = _INVERTED_SHIFT_MAP[key];
                    const [characters] = this.characterFromEvent(event);
                    const allModifiers = Object.keys(modifiers).map((key) => {
                        return modifiers[key];
                    });
                    const hasModifiers = allModifiers.some((modifier) => event[modifier]);

                    const result = Array.isArray(characters)
                        ? [...characters, event.key]
                        : [characters, event.key];

                    // if has modifiers:
                    // we want to make sure it is not upper case letters
                    // (because upper has modifiers so we want continue the check)
                    // we also want to make sure it is not alphanumeric char like ? / ^ & and others (since those could require modifiers as well)
                    // we also want to check this only if the length of
                    // of the keys is one (i.e the command key is "?" or "c"
                    // this while check is here to verify that:
                    // if registered key like "e"
                    // it won't be fired when clicking ctrl + e, or any modifiers + the key
                    // we only want to trigger when the single key is clicked alone
                    // thus all these edge cases.
                    // hopefully this would cover all cases
                    // TODO:: find a way simplify this
                    if (
                        hasModifiers &&
                        (!isUpper || isNonAlpha) &&
                        !inShiftMap &&
                        keys.length === 1
                    ) {
                        return false;
                    }
                    return result.some((char) => {
                        if (char === key && isUpper) {
                            return true;
                        }
                        return key === char;
                    });
                };
            });
    };

    /**
     * @ignore
     * @param event
     */
    private modifiersOn(event) {
        return ["metaKey", "altKey", "ctrlKey"].some((mod) => event[mod]);
    }

    /**
     * @ignore
     * Parse each command using getKeys function
     */
    private parseCommand(command: ShortcutInput | ShortcutInput[]): ParsedShortcut[] {
        const commands = Array.isArray(command) ? command : [command];
        return commands.map((command) => {
            const keys = Array.isArray(command.key) ? command.key : [command.key];
            const priority = Math.max(...keys.map((key) => key.split(" ").filter(identity).length));
            const predicates = keys.map((key) => this.getKeys(key.split(" ").filter(identity)));
            const isSequence = this.isSequence(keys);
            const sequence = isSequence
                ? keys.map((key) =>
                      key
                          .split(" ")
                          .filter(identity)
                          .map((key) => key.trim())
                  )
                : [];
            return {
                ...command,
                isSequence,
                sequence: isSequence ? sequence : [],
                allowIn: command.allowIn || [],
                key: keys,
                id: `${guid++}`,
                throttle: isNill(command.throttleTime) ? this.throttleTime : command.throttleTime,
                priority: priority,
                predicates: predicates
            } as ParsedShortcut;
        });
    }
}
