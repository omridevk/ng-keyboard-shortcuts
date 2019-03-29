import { ModuleWithProviders, NgModule } from "@angular/core";
import { NgKeyboardShortcutsComponent } from "./ng-keyboard-shortcuts.component";
import { KeyboardShortcutsService } from "./ng-keyboard-shortcuts.service";
import { NgKeyboardShortcutsHelpService } from './ng-keyboard-shortcuts-help.service';



@NgModule({
    imports: [],
    declarations: [NgKeyboardShortcutsComponent],
    exports: [NgKeyboardShortcutsComponent]
})
export class KeyboardShortcutsModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: KeyboardShortcutsModule,
            providers: [
                KeyboardShortcutsService,
                NgKeyboardShortcutsHelpService
            ]
        };
    }
}
