import {
    ApplicationRef,
    Component,
    ComponentFactoryResolver,
    Injector,
    Input, OnChanges, OnDestroy,
    OnInit, SimpleChange, SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import { DomPortalOutlet } from "./dom-portal-outlet";
import { TemplatePortal } from "./portal";
import { KeyboardShortcutsService } from "./ng-keyboard-shortcuts.service";
import { NgKeyboardShortcutsHelpService } from "./ng-keyboard-shortcuts-help.service";
import { animate, style, transition, trigger } from '@angular/animations';
import { distinctUntilChanged } from 'rxjs/operators';
import { groupBy } from "./utils";
import { map } from "rxjs/internal/operators";
import { SubscriptionLike } from "rxjs";

@Component({
    selector: "ng-keyboard-shortcuts-help",
    templateUrl: "./ng-keyboard-shortcuts-help.component.html",
    styleUrls: ["./ng-keyboard-shortcuts-help.component.css"],
    animations: [
        trigger("enterAnimation", [
            transition(":enter", [
                style({ transform: "translateX(-100%)", opacity: 0 }),
                animate(
                    "0.33s cubic-bezier(0,0,0.3,1)",
                    style({ transform: "translateX(0)", opacity: 1 })
                )
            ]),
            transition(":leave", [
                style({ transform: "translateX(0)", opacity: 1 }),
                animate(
                    "0.23s cubic-bezier(0,0,0.3,1)",
                    style({ transform: "translateX(-100%)", opacity: 0 })
                )
            ])
        ]),
        trigger("overlayAnimation", [
            transition(":enter", [
                style({ opacity: 0 }),
                animate("1s cubic-bezier(0,0,0.3,1)", style({ opacity: 1 }))
            ]),
            transition(":leave", [
                style({ opacity: 1 }),
                animate("1s cubic-bezier(0,0,0.3,1)", style({ opacity: 0 }))
            ])
        ])
    ],
})
export class NgKeyboardShortcutsHelpComponent implements OnInit, OnChanges, OnDestroy {
    @Input() attachToBody = true;
    @Input() key: string;
    @Input() title = "Keyboard shortcuts";
    @Input() emptyMessage = "No shortcuts available";
    shortcuts: {label: string, key: string | string[], description: string}[];
    labels: string[];
    @ViewChild(TemplateRef) template: TemplateRef<any>;

    showing = false;
    private bodyPortalHost: DomPortalOutlet;
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private keyboard: KeyboardShortcutsService,
        private keyboardHelp: NgKeyboardShortcutsHelpService,
        private viewContainer: ViewContainerRef,
        private injector: Injector
    ) {
        this.bodyPortalHost = new DomPortalOutlet(
            document.body,
            this.componentFactoryResolver,
            this.appRef,
            this.injector
        );
    }
    reveal() {
        this.hide();

        const portal = new TemplatePortal(this.template, this.viewContainer);
        this.bodyPortalHost.attach(portal);
        this.showing = true;
    }

    visible() {
        return this.bodyPortalHost.hasAttached();
    }

    hide() {
        if (!this.bodyPortalHost.hasAttached()) {
            return;
        }
        this.bodyPortalHost.detach();
        this.showing = false;
    }
    ngOnDestroy(): void {
        this.hide();
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    toggle() {
      this.visible() ? this.hide() : this.reveal();
    }

    private subscription: SubscriptionLike;
    private clearIds;
    private timeoutId;

    ngOnInit() {
        this.subscription = this.keyboardHelp.shortcuts$.pipe(
            distinctUntilChanged(),
            map(shortcuts => groupBy(shortcuts, 'label'))
        ).subscribe(shortcuts => {
            this.shortcuts = shortcuts;
            this.labels = Object.keys(shortcuts);
        });
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }
        if (!changes.key.currentValue) {
            return;
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
            this.clearIds = this.keyboard.add({
                key: this.key,
                preventDefault: true,
                command: () => this.toggle()
            });
        });
    }
}
