import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { KeyboardShortcutsService } from "./shared/services/shortcut.service";
import { KeyboardShortcutsHelpService } from "./shared/services/shortcut-help.service";
import { KeyboardShortcutsSelectService } from "./shared/services/shortcut-select.service";
import { KeyboardShortcutsDirective } from "./shared/directives/keyboard-shortcuts.directive";

import { KeyboardShortcutsComponent } from "./components/keyboard-shortcuts/keyboard-shortcuts.component";
import { KeyboardShortcutsHelpComponent } from './components/help/help.component';
import { KeyboardShortcutsHelpItemComponent } from "./components/help/item/item.component";

@NgModule({
    imports: [CommonModule],
    declarations: [
        KeyboardShortcutsComponent,
        KeyboardShortcutsDirective,
        KeyboardShortcutsHelpComponent,
        KeyboardShortcutsHelpItemComponent
    ],
    exports: [
        KeyboardShortcutsComponent,
        KeyboardShortcutsDirective,
        KeyboardShortcutsHelpComponent
    ]
})
export class KeyboardShortcutsModule {
    public static forRoot(): ModuleWithProviders<KeyboardShortcutsModule> {
        return {
            ngModule: KeyboardShortcutsModule,
            providers: [
                KeyboardShortcutsService,
                KeyboardShortcutsHelpService,
                KeyboardShortcutsSelectService
            ]
        };
    }
}
