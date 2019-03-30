import {
    ApplicationRef,
    Component,
    ComponentFactoryResolver,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChange,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import { DomPortalOutlet } from "./dom-portal-outlet";
import { TemplatePortal } from "./portal";
import { KeyboardShortcutsService } from "./ng-keyboard-shortcuts.service";
import { NgKeyboardShortcutsHelpService } from "./ng-keyboard-shortcuts-help.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { distinctUntilChanged } from "rxjs/operators";
import { groupBy } from "./utils";
import { map } from "rxjs/internal/operators";
import { SubscriptionLike } from "rxjs";

const scrollAbleKeys = new Map([[31, 1], [38,1], [39, 1], [40, 1]]);
const preventDefault = e => {
    e = e || window.event;
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
};

const preventDefaultForScrollKeys = e => {
    if (!scrollAbleKeys.has(e.keyCode)) {
        return;
    }
    preventDefault(e);
    return false;
};
const scrollEvents = ['wheel', 'touchmove', 'DOMMouseScroll'];

const disableScroll = () => {
    scrollEvents.forEach(event => window.addEventListener(event, preventDefault, false));
    window.addEventListener('keydown', preventDefaultForScrollKeys);
};

const enableScroll = () => {
    scrollEvents.forEach(event => window.removeEventListener(event, preventDefault));
    window.removeEventListener('keydown', preventDefaultForScrollKeys);
};

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
    ]
})
export class NgKeyboardShortcutsHelpComponent implements OnInit, OnDestroy {
    @Input() disableScrolling = true;
    private _key: string;
    @Input()
    set key(value: string) {
        this._key = value;
        if (!value) {
            return;
        }
        this.clearIds = this.keyboard.add({
            key: value,
            preventDefault: true,
            command: () => this.toggle()
        });
    }
    @Input() title = "Keyboard shortcuts";
    @Input() emptyMessage = "No shortcuts available";
    @ViewChild(TemplateRef) template: TemplateRef<any>;
    shortcuts: { label: string; key: string | string[]; description: string }[];
    showing = false;
    labels: string[];

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
        if (this.disableScrolling) {
            disableScroll();
        }
        const portal = new TemplatePortal(this.template, this.viewContainer);
        this.bodyPortalHost.attach(portal);
        this.showing = true;
    }

    visible() {
        return this.bodyPortalHost.hasAttached();
    }

    hide() {
        if (this.disableScrolling) {
            enableScroll();
        }
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
        this.subscription = this.keyboardHelp.shortcuts$
            .pipe(distinctUntilChanged(), map(shortcuts => groupBy(shortcuts, "label")))
            .subscribe(shortcuts => {
                this.shortcuts = shortcuts;
                this.labels = Object.keys(shortcuts);
            });
    }
}
