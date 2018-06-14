import {Injectable} from '@angular/core';
import {catchError, filter, map, tap, throttleTime} from 'rxjs/internal/operators';
import {fromEvent, Subject, Subscription, throwError} from 'rxjs/index';
import {isFunction} from 'rxjs/internal/util/isFunction';
import {codes, modifiers} from './keys';


export interface Shortcut {
  key: string;
  target?: HTMLElement;
  preventDefault?: boolean;
  command(event: KeyboardEventOutput): void;
}

interface ParsedShortcut {
  key: string;
  predicates: Function[];
  preventDefault?: boolean;
  priority?: number;
  event?: KeyboardEvent;
  target?: HTMLElement;
  command(event: KeyboardEventOutput): void;
}

export interface KeyboardEventOutput {
  event: KeyboardEvent;
  key: string;
}

@Injectable()
export class KeyboardShortcutsService {

  /**
   * Parsed shortcuts
   * for each key create a predicate function
   * { key: Function[], command: func,
   * @type {Array}
   */
  private shortcuts: ParsedShortcut[] = [];


  /**
   * Throttle the keypress event.
   * @type {number}
   */
  private throttleTime = 100;

  private _pressed = new Subject<KeyboardEventOutput>();
  public pressed$ = this._pressed.asObservable();


  /**
   * Subscription for on destroy.
   */
  private subscription: Subscription;

  constructor() {
    this.keydown(this.throttleTime).subscribe();
  }

  private mapEvent = (shortcuts: ParsedShortcut[]) => ( event ) =>
    shortcuts.map(shortcut => Object.assign({}, shortcut, {
      priority: shortcut.predicates.length,
      predicates: shortcut.predicates.map((predicate: any) => predicate(event)).every((item) => item),
      event: event
    }))
      .filter(shortcut => shortcut.predicates)
      .reduce((acc, shortcut) => {
        if (acc.priority > shortcut.priority ) {
          return acc;
        }
        return shortcut;
      }, { priority: 0} as ParsedShortcut);

  /**
   * @returns Observable<any>
   * @param timeToThrottle
   */
  private keydown = (timeToThrottle: number) => fromEvent(document, 'keydown')
    .pipe(
      map(this.mapEvent(this.shortcuts)),
      filter((shortcut: ParsedShortcut) => !shortcut.target || shortcut.event.target === shortcut.target),
      tap((shortcut: ParsedShortcut) => !shortcut.preventDefault || shortcut.event.preventDefault()),
      filter((shortcut: ParsedShortcut) => isFunction(shortcut.command)),
      throttleTime(timeToThrottle),
      tap((shortcut: ParsedShortcut) => shortcut.command({event: shortcut.event, key: shortcut.key})),
      tap(this._pressed),
      catchError(() => throwError('error in shortcut service'))
    );

  /**
   * Add new shortcut/s
   * @param {Shortcut[] | Shortcut} shortcuts
   * @returns {KeyboardShortcutsService}
   */
  public add(shortcuts: Shortcut[] | Shortcut) {
    if (Array.isArray(shortcuts)) {
      shortcuts.forEach((shortcut) => this.shortcuts.push(this.parseCommand(shortcut)));
      return this;
    }
    this.shortcuts.push(this.parseCommand(shortcuts));
    return this;
  }

  /**
   * Set throttleTime for the keydown event
   * Default: 100
   * @param {number} time
   * @returns {KeyboardShortcutsService}
   */
  public setThrottleTime(time: number) {
    this.throttleTime = time;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.keydown(this.throttleTime).subscribe();
    return this;
  }

  /**
   * transforms a shortcut to:
   * a predicate function, example:
   */
  private getKeys = (command) => command.key.split(' ')
    .map(key => key.trim())
    .filter(key => key !== '+')
    .map(key => {
      // for modifiers like control key
      // look for event['ctrlKey']
      // otherwise use the keyCode
      if (modifiers.hasOwnProperty(key)) {
        return (event) => !!event[modifiers[key]];
      }
      return (event) => event.keyCode === key.toUpperCase().charCodeAt(0)
        || event.keyCode === codes[key];
    });

  /**
   * Parse each command using getKeys function
   * @param {Shortcut} command
   * @returns {ParsedShortcut}
   */
  private parseCommand(command: Shortcut): ParsedShortcut {
    return Object.assign({}, command, {
      'predicates': this.getKeys(command),
    });
  }

}
