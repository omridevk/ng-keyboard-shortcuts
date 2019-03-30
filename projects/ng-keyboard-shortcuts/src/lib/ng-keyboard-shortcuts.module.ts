import { ModuleWithProviders, NgModule } from "@angular/core";
import { NgKeyboardShortcutsComponent } from "./ng-keyboard-shortcuts.component";
import { KeyboardShortcutsService } from "./ng-keyboard-shortcuts.service";
import { NgKeyboardShortcutsHelpService } from './ng-keyboard-shortcuts-help.service';
import { NgKeyboardShortcutsDirective } from './ng-keyboard-shortcuts.directive';
import { NgKeyboardShortcutsHelpComponent } from './ng-keyboard-shortcuts-help.component';



@NgModule({
    imports: [],
    entryComponents: [NgKeyboardShortcutsHelpComponent],
    declarations: [NgKeyboardShortcutsComponent, NgKeyboardShortcutsDirective, NgKeyboardShortcutsHelpComponent],
    exports: [NgKeyboardShortcutsComponent, NgKeyboardShortcutsDirective, NgKeyboardShortcutsHelpComponent]
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
