import {
  Injectable,
  OnDestroy
}                           from '@angular/core';
import { codes, modifiers } from './keys';
import { Observable }       from 'rxjs/Observable';
import { isFunction }       from 'rxjs/util/isFunction';
import { Subscription }     from 'rxjs/Subscription';
import 'rxjs/add/operator/scan';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';


export interface Shortcut {
  key: string;
  command(event: KeyboardEventOutput) : void,
  target?: HTMLElement,
  preventDefault?: boolean
}

interface ParsedShortcut {
  key: string,
  predicates: Function[],
  command<T>(event: KeyboardEventOutput) : T,
  preventDefault?: boolean,
  priority?: number,
  event?: KeyboardEvent,
  target?: HTMLElement
}

export interface KeyboardEventOutput {
  event: KeyboardEvent,
  key: string
}

@Injectable()
export class KeyboardShortcutsService implements OnDestroy {


  constructor() {
    this.subscription = this.keydown(this.throttleTime).subscribe();
  }

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
  private throttleTime: number = 100;

  private _pressed = new Subject<KeyboardEventOutput>();
  public pressed$ = this._pressed.asObservable();


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
   * Subscription for on destroy.
   */
  private subscription: Subscription;

  /**
   * @returns Observable<any>
   * @param throttleTime
   */
  private keydown = (throttleTime: number) => Observable.fromEvent(document, 'keydown')
    .map(this.mapEvent(this.shortcuts))
    .filter(shortcut => !shortcut.target || shortcut.event.target === shortcut.target)
    .do(shortcut => !shortcut.preventDefault || shortcut.event.preventDefault())
    .filter((shortcut: any) => isFunction(shortcut.command))
    .throttleTime(throttleTime)
    .do(shortcut => shortcut.command({event: shortcut.event, key: shortcut.key}))
    .do(this._pressed)
    .catch(error => Observable.throw("error in shortcut service"));


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
