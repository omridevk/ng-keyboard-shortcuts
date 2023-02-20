import {Injectable, NgZone} from "@angular/core";
import {EventManager} from "@angular/platform-browser";
import {KeyboardShortcutsService} from './ng-keyboard-shortcuts.service';
import {ShortcutEventOutput} from './ng-keyboard-shortcuts.interfaces';


@Injectable()
export class KeyboardShortcutsPlugin {
    manager: EventManager;

    constructor(private ngZone: NgZone, private keyboard: KeyboardShortcutsService) {
    }

    supports(eventName: string): boolean {
        return eventName.split('.').includes('shortcut')
    }

    addEventListener(
        element,
        eventName,
        originalHandler
    ): Function {
        const shortcut = eventName
            .split('.')

        const preventDefault = shortcut.includes("prevent");
        if (shortcut.length === 0)  {
            throw new Error("please provide a shortcut");
        }
        const [,key, description, label] = shortcut;
        const id = this.keyboard.add({
            key,
            command(event: ShortcutEventOutput): any {
                originalHandler(event)
            },
            description,
            preventDefault,
            label
        })
        return () => {
            this.keyboard.remove(id);
        };
    }
}
