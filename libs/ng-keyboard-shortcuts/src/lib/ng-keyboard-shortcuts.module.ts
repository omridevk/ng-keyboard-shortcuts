import {ModuleWithProviders, NgModule} from '@angular/core';
import {KeyboardShortcutsComponent} from './ng-keyboard-shortcuts.component';
import {KeyboardShortcutsService} from './ng-keyboard-shortcuts.service';
import {KeyboardShortcutsHelpService} from './ng-keyboard-shortcuts-help.service';
import {KeyboardShortcutsSelectService} from './ng-keyboard-shortcuts-select.service';
import {KeyboardShortcutsDirective} from './ng-keyboard-shortcuts.directive';
import {KeyboardShortcutsHelpComponent} from './ng-keyboard-shortcuts-help.component';
import {KeyboardShortcutsHelpItemComponent} from './ng-keyboard-shortcuts-help-item.component';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [CommonModule],
    entryComponents: [KeyboardShortcutsHelpComponent],
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
