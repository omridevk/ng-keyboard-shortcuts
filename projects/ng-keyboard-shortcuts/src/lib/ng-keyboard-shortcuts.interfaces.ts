export interface ShortcutBase {
    command(event: ShortcutEventOutput): any;
    description?: string;
    throttleTime?: number;
    allowIn?: string[];
    label?: string;
    target?: HTMLElement;
    preventDefault?: boolean;
}


export interface Shortcut extends ShortcutBase {
    key: string[];
}

export interface ShortcutInput extends ShortcutBase {
    key: string | string[];
}

export interface ParsedShortcut extends Shortcut {
    predicates: Function[][];
    priority?: number;
    event?: KeyboardEvent;
}
export interface ShortcutEventOutput {
    event: KeyboardEvent | MouseEvent;
    key: string | string[];
}

export interface ToggleHelp {
    toggleHelp();
    showHelp();
    hideHelp();
    visible();
}
