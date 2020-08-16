import { invert } from './utils';

const isMac = typeof navigator !== "undefined" ? navigator.userAgent.includes("Mac OS") : false;

export const modifiers = {
    shift: "shiftKey",
    ctrl: "ctrlKey",
    alt: "altKey",
    cmd: isMac ? "metaKey" : "ctrlKey",
    command: isMac ? "metaKey" : "ctrlKey",
    meta: isMac ? "metaKey" : "ctrlKey",
    "left command": "metaKey",
    "right command": "MetaRight",
    "⌘": isMac ? "metaKey" : "ctrlKey",
    option: "altKey",
    ctl: "ctrlKey",
    control: "ctrlKey"
};
export const _SPECIAL_CASES = {
    plus: "+"
};

export const symbols = {
    cmd: isMac ? "⌘" : "Ctrl",
    command: isMac ? "⌘" : "Ctrl",
    "left command": isMac ? "⌘" : "Ctrl",
    "right command": isMac ? "⌘" : "Ctrl",
    option: isMac ? "⌥" : "Alt",
    plus: "+",
    left: "←",
    right: "→",
    up: "↑",
    down: "↓",
    alt: isMac ? "⌥" : "Alt",
    ctrl: "Ctrl",
    control: "Ctrl",
    shift: "⇧"
};

export const _MAP = {
    8: "backspace",
    9: "tab",
    13: "enter",
    16: "shift",
    17: ["ctrl", "control"],
    18: "alt",
    20: "capslock",
    27: ["esc", "escape"],
    32: ["space", "spc"],
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    45: "ins",
    46: "del",
    91: ["meta", "cmd", "command"],
    93: ["meta", "cmd", "command"],
    224: ["meta", "cmd", "command"]
};

/*
 * mapping for special characters so they can support
 *
 * this dictionary is only used incase you want to bind a
 * keyup or keydown event to one of these keys
 *
 */
export const _KEYCODE_MAP = {
    106: "*",
    107: "+",
    109: "-",
    110: ".",
    111: "/",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'"
};

/**
 * this is a mapping of keys that require shift on a US keypad
 * back to the non shift equivelents
 *
 * this is so you can use keyup events with these keys
 *
 * note that this will only work reliably on US keyboards
 *
 */
export const _SHIFT_MAP = {
    "`": "~",
    "1": "!",
    "2": "@",
    "3": "#",
    "4": "$",
    "5": "%",
    "6": "^",
    "7": "&",
    "8": "*",
    "9": "(",
    "0": ")",
    "-": "_",
    "=": "+",
    ";": ":",
    "'": '"',
    ",": "<",
    ".": ">",
    "/": "?",
    "\\": "|"
};
export const _INVERTED_SHIFT_MAP = invert(_SHIFT_MAP);

/**
 * loop through the f keys, f1 to f19 and add them to the map
 * programatically
 */
for (let i = 1; i < 20; ++i) {
    _MAP[111 + i] = "f" + i;
}

/**
 * loop through to map numbers on the numeric keypad
 */
for (let i = 0; i <= 9; ++i) {
    // This needs to use a string cause otherwise since 0 is falsey
    // event will never fire for numpad 0 pressed as part of a keydown
    // event.
    _MAP[i + 96] = i.toString();
}
