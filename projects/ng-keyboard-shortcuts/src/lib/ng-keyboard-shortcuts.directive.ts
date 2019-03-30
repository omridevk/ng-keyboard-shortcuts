import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { AllowIn, Shortcut } from "./ng-keyboard-shortcuts.interfaces";
import { KeyboardShortcutsService } from "./ng-keyboard-shortcuts.service";

@Directive({
    selector: "[ngKeyboardShortcuts]"
})
export class NgKeyboardShortcutsDirective implements OnDestroy, OnChanges {
    private clearIds;
    @Input() ngKeyboardShortcuts: Shortcut[];
    constructor(private keyboard: KeyboardShortcutsService, private el: ElementRef) {}

    ngOnDestroy() {
        if (!this.clearIds) {
            return;
        }
        this.keyboard.remove(this.clearIds);
    }

    ngOnChanges(changes: SimpleChanges) {
        const { ngKeyboardShortcuts } = changes;
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }
        if (!ngKeyboardShortcuts.currentValue) {
            return;
        }
        const shortcuts = ngKeyboardShortcuts.currentValue.map(shortcut => ({
            ...shortcut,
            target: this.el.nativeElement,
            allowIn: [AllowIn.Select, AllowIn.Input, AllowIn.Textarea]
        }));
        this.clearIds = this.keyboard.add(shortcuts);
    }
}
