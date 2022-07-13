/*
 * Public API Surface of ng-keyboard-shortcuts
 */

export { KeyboardShortcutsModule } from "./lib/ng-keyboard-shortcuts.module";
import "./lib/polyfills";

export {
    ShortcutInput,
    ShortcutEventOutput,
    AllowIn,
    Shortcut as ShortcutDirectiveInput
} from "./lib/ng-keyboard-shortcuts.interfaces";
export { KeyboardShortcutsHelpService } from "./lib/ng-keyboard-shortcuts-help.service";
export * from "./lib/ng-keyboard-shortcuts.plugin";
export { KeyboardShortcutsSelectService } from "./lib/ng-keyboard-shortcuts-select.service";
export { KeyboardShortcutsComponent } from "./lib/ng-keyboard-shortcuts.component";
export { KeyboardShortcutsDirective } from "./lib/ng-keyboard-shortcuts.directive";
export { KeyboardShortcutsHelpComponent } from "./lib/ng-keyboard-shortcuts-help.component";
export * from "./lib/keyboard-shortcut.component";
