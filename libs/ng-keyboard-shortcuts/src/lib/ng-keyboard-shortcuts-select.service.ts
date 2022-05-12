import {Injectable} from '@angular/core';
import {KeyboardShortcutsService} from './ng-keyboard-shortcuts.service';

@Injectable({
    providedIn: 'root'
})
/**
 * Use this service to listen to a specific keyboards events using Rxjs.
 * The shortcut must be declared in the app for the select to work.
 */
export class KeyboardShortcutsSelectService {
    constructor(private keyboardService: KeyboardShortcutsService) {
    }

    /**
     * Returns an observable of keyboard shortcut filtered by a specific key.
     * @param key - the key to filter the observable by.
     */
    public select(key: string) {
        return this.keyboardService.select(key);
    }
}
