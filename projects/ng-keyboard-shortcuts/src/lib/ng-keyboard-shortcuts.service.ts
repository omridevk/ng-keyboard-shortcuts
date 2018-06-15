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
    public pressed$ = this._pressed.asObservable();

    private _ignored = ["INPUT", "TEXTAREA", "SELECT"];

    /**
     * Subscription for on destroy.
     */
    private subscription: Subscription;

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
            .map(shortcut => {
                return Object.assign({}, shortcut, {
                    predicates: any(
                        identity,
                        shortcut.predicates.map((predicates: any) => allPass(predicates)(event))
                    ),
                    event: event
                });
            })
            .filter(shortcut => shortcut.predicates)
            .reduce((acc, shortcut) => (acc.priority > shortcut.priority ? acc : shortcut), {
                priority: 0
            } as ParsedShortcut);

    private keydown$ = fromEvent(document, "keydown").pipe(
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

    public get shortcuts() {
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
     * Add new shortcut/s
     */
    public add(shortcuts: ShortcutInput[] | ShortcutInput) {
        if (Array.isArray(shortcuts)) {
            shortcuts.forEach(shortcut => this._shortcuts.push(this.parseCommand(shortcut)));
            return this;
        }
        this._shortcuts.push(this.parseCommand(shortcuts));
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
                return event => {
                    return codes[key]
                        ? event.keyCode === codes[key] || event.key === key
                        : event.keyCode === key.toUpperCase().charCodeAt(0);
                };
            });

    /**
     * Parse each command using getKeys function
     */
    private parseCommand(command: ShortcutInput): ParsedShortcut {
        const keys = Array.isArray(command.key) ? command.key : [command.key];
        const priority = Math.max(...keys.map(key => key.split(" ").length));
        const predicates = keys.map(key => this.getKeys(key.split(" ")));
        return Object.assign({}, command, {
            allowIn: command.allowIn || [],
            key: keys,
            throttle: isNill(command.throttleTime) ? this.throttleTime : command.throttleTime,
            priority: priority,
            predicates: predicates
        });
    }
}
