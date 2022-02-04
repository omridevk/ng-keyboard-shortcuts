import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";

import { AllowIn, Shortcut } from "./../models/shortcut";
import { KeyboardShortcutsService } from "./../services/shortcut.service";

/**
 * A directive to be used with "focusable" elements, like:
 * textarea, input, select.
 */
@Directive({
    selector: "[ngKeyboardShortcuts]"
})
export class KeyboardShortcutsDirective implements OnDestroy, OnChanges {
    /**
     * clearId to remove shortcuts.
     */
    private clearIds;
    /**
     * Shortcut inputs for the directive.
     * will only work when the element is in focus
     */
    @Input() ngKeyboardShortcuts: Shortcut[];
    /**
     * @ignore
     * @type {boolean}
     * @private
     */
    private _disabled = false;

    /**
     * whether to disable the shortcuts for this directive
     * @param value
     */
    @Input() set disabled(value) {
        this._disabled = value;

        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }

        setTimeout(() => {
            if (value === false && this.ngKeyboardShortcuts) {
                this.clearIds = this.keyboard.add(this.transformInput(this.ngKeyboardShortcuts));
            }
        });
    }

    /**
     * @ignore
     * @param {KeyboardShortcutsService} keyboard
     * @param {ElementRef} el
     */
    constructor(private keyboard: KeyboardShortcutsService, private el: ElementRef) {}

    /**
     * @ignore
     * @param {Shortcut[]} shortcuts
     * @returns {any}
     */
    private transformInput(shortcuts: Shortcut[]) {
        return shortcuts.map(shortcut => ({
            ...shortcut,
            target: this.el.nativeElement,
            allowIn: [AllowIn.Select, AllowIn.Input, AllowIn.Textarea]
        }));
    }

    /**
     * @ignore
     */
    ngOnDestroy() {
        if (!this.clearIds) {
            return;
        }

        this.keyboard.remove(this.clearIds);
    }

    /**
     * @ignore
     * @param {SimpleChanges} changes
     */
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
