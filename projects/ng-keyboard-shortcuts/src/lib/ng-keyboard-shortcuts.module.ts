import { ModuleWithProviders, NgModule } from "@angular/core";
import { NgKeyboardShortcutsComponent } from "./ng-keyboard-shortcuts.component";
import { KeyboardShortcutConfigToken, KeyboardShortcutsService } from "./ng-keyboard-shortcuts.service";
import { KeyboardShortcutConfig } from "./ng-keyboard-shortcuts.interfaces";
import { NgKeyboardShortcutsHelpComponent } from './ng-keyboard-shortcuts-help.component';



@NgModule({
    imports: [],
    declarations: [NgKeyboardShortcutsComponent, NgKeyboardShortcutsHelpComponent],
    exports: [NgKeyboardShortcutsComponent, NgKeyboardShortcutsHelpComponent]
})
export class KeyboardShortcutsModule {
    public static forRoot(config: KeyboardShortcutConfig): ModuleWithProviders {
        return {
            ngModule: KeyboardShortcutsModule,
            providers: [
                KeyboardShortcutsService,
                {
                    provide: KeyboardShortcutConfigToken,
                    useValue: config
                }
            ]
        };
    }
}
