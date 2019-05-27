/**
 * The shortcut input for the Directive
 */
export interface Shortcut {

    /**
     * A key or list of keys to listen to and fire the command.
     */
    key: string | string[];

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
     * Label, can be used for grouping commands.
     */
    label?: string;

    /**
     * Prevent browser default, default: false
     */
    preventDefault?: boolean;
}

/**
 * The shortcut input type for ng-keyboard-shortcuts component
 */
export interface ShortcutInput extends Shortcut {
    /**
     * textarea, select and input are ignored by default, this is used to override
     * this behavior.
     * allow in node names, accepts: ["TEXTAREA", "SELECT", "INPUT]
     */
    allowIn?: AllowIn[];
    /**
     * Only trigger the command when the target is in focus.
     */
    target?: HTMLElement;
}

export enum AllowIn {
    Textarea = 'TEXTAREA',
    Input = 'INPUT',
    Select = "SELECT"
}

/**
 * @ignore
 */
export interface ParsedShortcut extends ShortcutInput {
    key: string[];
    predicates: Function[][];
    id: string;
    priority?: number;

    isSequence: boolean;
    sequence?: string[][];
    event?: KeyboardEvent;
}

/**
 * The output type fired by the command when shortcut is triggered.
 */
export interface ShortcutEventOutput {
    /**
     * The browser keyboard event
     */
    event: KeyboardEvent;
    /**
     * The registered key that was triggered
     */
    key: string[] | string;
}