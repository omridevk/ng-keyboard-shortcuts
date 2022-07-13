import {Inject, ModuleWithProviders, NgModule} from "@angular/core";
import {KeyboardShortcutsComponent} from "./ng-keyboard-shortcuts.component";
import {KeyboardShortcutsService} from "./ng-keyboard-shortcuts.service";
import {KeyboardShortcutsHelpService} from "./ng-keyboard-shortcuts-help.service";
import {KeyboardShortcutsSelectService} from "./ng-keyboard-shortcuts-select.service";
import {KeyboardShortcutsDirective} from "./ng-keyboard-shortcuts.directive";
import {KeyboardShortcutsHelpComponent} from "./ng-keyboard-shortcuts-help.component";
import {KeyboardShortcutsHelpItemComponent} from "./ng-keyboard-shortcuts-help-item.component";
import {CommonModule} from "@angular/common";
import {KeyboardShortcutsPlugin} from "./ng-keyboard-shortcuts.plugin";
import {KeyboardShortcutComponent} from "./keyboard-shortcut.component";
import {EVENT_MANAGER_PLUGINS} from "@angular/platform-browser";

@NgModule({
    imports: [CommonModule],
    entryComponents: [KeyboardShortcutsHelpComponent],
    declarations: [
        KeyboardShortcutsComponent,
        KeyboardShortcutsDirective,
        KeyboardShortcutsHelpComponent,
        KeyboardShortcutsHelpItemComponent,
        KeyboardShortcutComponent
    ],
    exports: [
        KeyboardShortcutsComponent,
        KeyboardShortcutsDirective,
        KeyboardShortcutsHelpComponent,
        KeyboardShortcutComponent
    ]
})
export class KeyboardShortcutsModule {
    public static forRoot(): ModuleWithProviders<KeyboardShortcutsModule> {
        return {
            ngModule: KeyboardShortcutsModule,
            providers: [
                KeyboardShortcutsService,
                KeyboardShortcutsHelpService,
                KeyboardShortcutsSelectService,
                {
                    multi: true,
                    provide: EVENT_MANAGER_PLUGINS,
                    useClass: KeyboardShortcutsPlugin
                }
            ]
        };
    }
}
