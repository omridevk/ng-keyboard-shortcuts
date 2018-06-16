import { Injectable, OnDestroy } from "@angular/core";
import { codes, modifiers } from "./keys";
import { fromEvent, Subscription, timer, Subject, throwError, Observable } from "rxjs";
import {
    ShortcutEventOutput,
    ParsedShortcut,
    ShortcutInput
} from "./ng-keyboard-shortcuts.interfaces";
import { map, filter, tap, debounce, catchError } from "rxjs/operators";
import { allPass, any, identity, isFunction, isNill } from "./utils";

const $$ngOnDestroy = Symbol("OnDestroy");

@Injectable({
    providedIn: "root"
})
export class KeyboardShortcutsService implements OnDestroy {
    /**
     * Parsed shortcuts
     * for each key create a predicate function
     */
    private _shortcuts: ParsedShortcut[] = [];

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

    private _ignored = ["INPUT", "TEXTAREA", "SELECT"];

    /**
     * Subscription for on destroy.
     */
    private readonly subscription: Subscription;

    private isAllowed = (shortcut: ParsedShortcut) => {
        const target = shortcut.event.target as HTMLElement;
        if (target === shortcut.target) {
            return true;
        }
        if (shortcut.allowIn.length) {
            return shortcut.allowIn.includes(target.nodeName);
        }
        return !this._ignored.includes(target.nodeName);
    };

    private mapEvent = event =>
        this._shortcuts
            .map(shortcut =>
                Object.assign({}, shortcut, {
                    predicates: any(
                        identity,
                        shortcut.predicates.map((predicates: any) => allPass(predicates)(event))
                    ),
                    event: event
                })
            )
            .filter(shortcut => shortcut.predicates)
            .reduce((acc, shortcut) => (acc.priority > shortcut.priority ? acc : shortcut), {
                priority: 0
            } as ParsedShortcut);

    private keydown$ = fromEvent(document, "keydown").pipe(
        filter(_ => !this.disabled),
        map(this.mapEvent),
        filter(
            (shortcut: ParsedShortcut) =>
                !shortcut.target || shortcut.event.target === shortcut.target
        ),
        filter((shortcut: ParsedShortcut) => isFunction(shortcut.command)),
        filter(this.isAllowed),
        tap(shortcut => !shortcut.preventDefault || shortcut.event.preventDefault()),
        debounce(shortcut => timer(shortcut.throttleTime)),
        tap(shortcut => shortcut.command({ event: shortcut.event, key: shortcut.key })),
        tap(shortcut => this._pressed.next({ event: shortcut.event, key: shortcut.key })),
        catchError(error => throwError(error))
    );

    private get shortcuts() {
        return this._shortcuts;
    }

    constructor() {
        this.subscription = this.keydown$.subscribe();
    }

    /**
     * Remove subscription.
     */
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    /**
     * Enable all keyboard shortcuts
     */
    enable() {
        this.disabled = false;
        return this;
    }

    /**
     * Disable all keyboard shortcuts
     */
    disable() {
        this.disabled = true;
        return this;
    }

    /**
     * Check if all keyboard shortcuts are disabled.
     */
    isDisabled() {
        return this.disabled;
    }

    /**
     * Add new shortcut/s
     */
    public add(shortcuts: ShortcutInput[] | ShortcutInput, instance?: any) {
        shortcuts = Array.isArray(shortcuts) ? shortcuts : [shortcuts];
        if (instance) {
            const [key] = [...shortcuts.map(shortcut => shortcut.key)];
            this.bindOnDestroy(instance, key);
        }

        this._shortcuts.push(...this.parseCommand(shortcuts));
        return this;
    }

    /**
     *
     * @param instance - component to remove keys when ngOnDestroy is called.
     * @param keys
     */
    private bindOnDestroy(instance, keys) {
        if (instance.ngOnDestroy) {
            instance[$$ngOnDestroy] = instance.ngOnDestroy;
        }
        const that = this;
        instance.ngOnDestroy = function() {
            const onDestroy = instance[$$ngOnDestroy];
            if (onDestroy) {
                onDestroy.apply(this);
            }
            that.remove(keys);
        };
    }

    public remove(key) {
        key = Array.isArray(key) ? key : [key];
        this._shortcuts = this._shortcuts.filter(shortcut => {
            return !shortcut.key.find(sKey => {
                return key.filter(k => k === sKey).length > 0;
            });
        });
        return this;
    }

    /**
     * transforms a shortcut to:
     * a predicate function
     */
    private getKeys = (command: string[]) =>
        command
            .map(key => key.trim())
            .filter(key => key !== "+")
            .map(key => {
                // for modifiers like control key
                // look for event['ctrlKey']
                // otherwise use the keyCode
                if (modifiers.hasOwnProperty(key)) {
                    return event => !!event[modifiers[key]];
                }
                return event =>
                    codes[key]
                        ? event.keyCode === codes[key] || event.key === key
                        : event.keyCode === key.toUpperCase().charCodeAt(0);
            });

    /**
     * Parse each command using getKeys function
     */
    private parseCommand(command: ShortcutInput | ShortcutInput[]): ParsedShortcut[] {
        const commands = Array.isArray(command) ? command : [command];
        return commands.map(command => {
            const keys = Array.isArray(command.key) ? command.key : [command.key];
            const priority = Math.max(...keys.map(key => key.split(" ").length));
            const predicates = keys.map(key => this.getKeys(key.split(" ")));
            return {
                ...command,
                allowIn: command.allowIn || [],
                key: keys,
                throttle: isNill(command.throttleTime) ? this.throttleTime : command.throttleTime,
                priority: priority,
                predicates: predicates
            } as ParsedShortcut;
        });
    }
}
