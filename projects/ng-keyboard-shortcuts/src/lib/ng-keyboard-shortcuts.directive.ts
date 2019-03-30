import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { AllowIn, Shortcut } from "./ng-keyboard-shortcuts.interfaces";
import { KeyboardShortcutsService } from "./ng-keyboard-shortcuts.service";

@Directive({
    selector: "[ngKeyboardShortcuts]"
})
export class NgKeyboardShortcutsDirective implements OnDestroy, OnChanges {
    private clearIds;
    @Input() ngKeyboardShortcuts: Shortcut[];
    private _disabled = false;
    @Input() set disabled(value) {
        this._disabled = value;
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }
        setTimeout(() => {
            if (value === false && this.ngKeyboardShortcuts) {
                this.clearIds = this.keyboard.add(this.transformInput(this.ngKeyboardShortcuts));
            }
        })

    }
    constructor(private keyboard: KeyboardShortcutsService, private el: ElementRef) {}

    transformInput(shortcuts: Shortcut[]) {
        return shortcuts.map(shortcut => ({
            ...shortcut,
            target: this.el.nativeElement,
            allowIn: [AllowIn.Select, AllowIn.Input, AllowIn.Textarea]
        }));
    }

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
        if (!ngKeyboardShortcuts || !ngKeyboardShortcuts.currentValue) {
            return;
        }
        this.clearIds = this.keyboard.add(this.transformInput(ngKeyboardShortcuts.currentValue));
    }
}
