import {
  Inject,
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

export type Shortcut = {
  key: any;
  command: Function,
  target?: HTMLElement
}

@Injectable()
export class KeyboardShortcutsService implements OnDestroy {
  constructor() {
    this.subscription = this.keydown$
      .filter((shortcut: any) => isFunction(shortcut.command))
      .throttleTime(100)
      .subscribe(
        shortcut => shortcut.command(),
        error => console.error(error)
      );
  }

  private shortcuts: Shortcut[] = [];

  /**
   * Subscription for on destroy.
   */
  private subscription: Subscription;
  /**
   * Key down observable
   * @type {Observable<any>}
   */
  private keydown$ = Observable.fromEvent(document, 'keydown')
    .map(event => this.shortcuts.map(shortcut => {
      return {
        keys: shortcut.key.map((predicate: any) => predicate(event)).every((item) => item),
        command: shortcut.command,
        target: shortcut.target || document,
        event: event
      }
    }))
    .map(shortcuts => shortcuts.filter(shortcut => shortcut.keys))
    .filter((shortcuts:any)=> shortcuts.length)
    .map(shortcuts => shortcuts.pop())
    .do(shortcuts => shortcuts.event.preventDefault());


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public addShortcuts(shortcuts: Shortcut[] | Shortcut) {
    if (Array.isArray(shortcuts)) {
      shortcuts.forEach((shortcut) => this.shortcuts.push(this.parseCommand(shortcut)));
      return;
    }
    this.shortcuts.push(this.parseCommand(shortcuts as Shortcut));
  }

  /**
   * transforms a shortcut to:
   * a predicate function, example:
   */
  private getKeys = (command) => command.key.split(' ')
    .map(key => key.trim())
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
   * Parse command
   * and transform it from keys string to key code
   * using getKeys function.
   * @param command
   * @returns Shortcut
   */
  private parseCommand = (command: Shortcut) => {
    return Object.assign({}, command, {
      'key': this.getKeys(command)
    });
  };

}
