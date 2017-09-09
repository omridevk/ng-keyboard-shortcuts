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
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

export type Shortcut = {
  key: any;
  command: Function,
  target?: HTMLElement,
  preventDefault?: boolean
};

type ParsedShortcut = {
  key: Function[],
  command: Function,
  preventDefault?: boolean,
  target?: HTMLElement
};

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


  private mapEvent = (shortcuts) => ( event ) =>
    shortcuts.map(shortcut => Object.assign({}, shortcut, {
      key: shortcut.key.map((predicate: any) => predicate(event)).every((item) => item),
      event: event
    }))
      .filter(shortcuts => shortcuts.key);

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
    .filter((shortcuts: any) => shortcuts.length)
    .map(shortcuts => shortcuts.pop())
    .filter(shortcut => !shortcut.target || shortcut.event.target === shortcut.target)
    .do(shortcut => !shortcut.preventDefault || shortcut.event.preventDefault())
    .filter((shortcut: any) => isFunction(shortcut.command))
    .throttleTime(throttleTime)
    .do(shortcut => shortcut.command())
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
  public addShortcuts(shortcuts: Shortcut[] | Shortcut) {
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
      'key': this.getKeys(command),
    });
  }

}
