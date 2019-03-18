import { InjectionToken } from "@angular/core";

export interface ShortcutBase {
    /**
     * callback to be called when shortcut is pressed.
     * @param event - the event out
     */
    command(event: ShortcutEventOutput): any;

    /**
     * Description for the command can be used for rendering help menu.
     */
    description?: string;

    /**
     * How much time to throttle in ms.
     */
    throttleTime?: number;

    /**
     * textarea, select and input are ignored by default, this is used to override
     * this behavior.
     * allow in node names, accepts: ["TEXTAREA", "SELECT", "INPUT]
     */
    allowIn?: string[];

    /**
     * Label, can be used for grouping commands.
     */
    label?: string;

    /**
     * Only trigger the command when the target is in focus.
     */
    target?: HTMLElement;

    /**
     * Prevent browser default, default: false
     */
    preventDefault?: boolean;
}

export interface Shortcut extends ShortcutBase {
    key: string[];
    component?: any;
}

export interface ShortcutInput extends ShortcutBase {
    key: string | string[];
}

export interface ParsedShortcut extends Shortcut {
    predicates: Function[][];
    id: string;
    priority?: number;
    event?: KeyboardEvent;
}
export interface ShortcutEventOutput {
    /**
     * The browser keyboard event
     */
    event: KeyboardEvent;
    key: string[];
}

export interface KeyboardShortcutConfig {
    showHelp: boolean;
    key: string;
}

