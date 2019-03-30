export interface Shortcut {

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


export interface ParsedShortcut extends ShortcutInput {
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
    key: string[] | string;
}