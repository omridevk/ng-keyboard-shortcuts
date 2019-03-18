import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { BodyPortal } from "./body-portal.service";
import { KeyboardShortcutsService } from "./ng-keyboard-shortcuts.service";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";

@Component({
    selector: "ng-keyboard-shortcuts-help",
    templateUrl: "./ng-keyboard-shortcuts-help.component.html",
    styleUrls: ["./ng-keyboard-shortcuts-help.component.css"]
})
export class NgKeyboardShortcutsHelpComponent implements OnInit {
    @ViewChild(TemplateRef) popup: TemplateRef<any>;

    constructor(
        private bodyPortal: BodyPortal,
        private view: ViewContainerRef,
        private _overlay: Overlay,
        private keyboard: KeyboardShortcutsService
    ) {}

    _overlayRef: OverlayRef;

    /** Create the overlay config and position strategy */
    private _createOverlay(): OverlayRef {
        if (this._overlayRef) {
            return this._overlayRef;
        }

        // Create connected position strategy that listens for scroll events to reposition.
        const strategy = this._overlay
            .position()
            .flexibleConnectedTo(document.body)
            .withPositions([{
                originX: 'center',
                originY: 'center',
                overlayX: 'center',
                overlayY: 'center'
            }])
            .withFlexibleDimensions(false)
            .withViewportMargin(8);

        strategy.positionChanges.subscribe(change => {
            console.log("here", { change });
        });

        this._overlayRef = this._overlay.create({
            direction: "ltr",
            positionStrategy: strategy,
            panelClass: "panel-class"
        });

        this._overlayRef
            .detachments()
            .pipe()
            .subscribe(() => console.log("detatchedment"));

        return this._overlayRef;
    }

    private _visible = false;
    @Input()
    set visible(value: boolean) {
        this._visible = value;
        if (value) {
            this.show();
            return;
        }
    }
    _portal: TemplatePortal<any>;

    show() {
        const overlayRef = this._createOverlay();
        this._portal = this._portal || new TemplatePortal(this.popup, this.view);
        overlayRef.attach(this._portal);
    }

    ngOnInit() {}
}
