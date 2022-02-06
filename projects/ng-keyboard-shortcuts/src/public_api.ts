/*
 * Public API Surface of ng-keyboard-shortcuts
 */

export { KeyboardShortcutsModule } from "./lib/ng-keyboard-shortcuts.module";
import "./polyfills";
export {
    ShortcutInput,
    ShortcutEventOutput,
    AllowIn,
    Shortcut as ShortcutDirectiveInput
} from "./lib/shared/models/shortcut";

export { KeyboardShortcutsHelpService } from "./lib/shared/services/shortcut-help.service";
export { KeyboardShortcutsSelectService } from "./lib/shared/services/shortcut-select.service";
export { KeyboardShortcutsDirective } from "./lib/shared/directives/keyboard-shortcuts.directive";

export { KeyboardShortcutsComponent } from "./lib/components/keyboard-shortcuts/keyboard-shortcuts.component";
export { KeyboardShortcutsHelpComponent } from "./lib/components/help/help.component";
