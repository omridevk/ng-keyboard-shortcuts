import { ModuleWithProviders, NgModule } from "@angular/core";
import { NgKeyboardShortcutsComponent } from "./ng-keyboard-shortcuts.component";
import { KeyboardShortcutsService } from "./ng-keyboard-shortcuts.service";
import { NgKeyboardShortcutsHelpService } from './ng-keyboard-shortcuts-help.service';
import { NgKeyboardShortcutsDirective } from './ng-keyboard-shortcuts.directive';
import { NgKeyboardShortcutsHelpComponent } from './ng-keyboard-shortcuts-help.component';
import { NgKeyboardShortcutsHelpItemComponent } from './ng-keyboard-shortcuts-help-item.component';
import { CommonModule } from "@angular/common";



@NgModule({
    imports: [CommonModule],
    entryComponents: [NgKeyboardShortcutsHelpComponent],
    declarations: [NgKeyboardShortcutsComponent, NgKeyboardShortcutsDirective, NgKeyboardShortcutsHelpComponent, NgKeyboardShortcutsHelpItemComponent],
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
