import {
    ApplicationRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import { DomPortalOutlet } from "./dom-portal-outlet";
import { TemplatePortal } from "./portal";
import { KeyboardShortcutsService } from "./ng-keyboard-shortcuts.service";
import { KeyboardShortcutsHelpService } from "./ng-keyboard-shortcuts-help.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { distinctUntilChanged, map } from "rxjs/operators";
import { groupBy } from './utils';
import { SubscriptionLike } from "rxjs";
import { Shortcut } from './ng-keyboard-shortcuts.interfaces';


/**
 * @ignore
 */
const scrollAbleKeys = new Map([
    [31, 1],
    [38, 1],
    [39, 1],
    [40, 1]
]);
/**
 * @ignore
 */
const preventDefault = (ignore: string) => e => {
    const modal = e.target.closest(ignore);
    if (modal) {
        return;
    }
    e = e || window.event;
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
};
/**
 * @ignore
 */
const preventDefaultForScrollKeys = e => {
    if (!scrollAbleKeys.has(e.keyCode)) {
        return;
    }
    preventDefault(e);
    return false;
};
/**
 * @ignore
 */
let scrollEvents = [
    { name: "wheel", callback: null },
    { name: "touchmove", callback: null },
    { name: "DOMMouseScroll", callback: null }
];

/**
 * @ignore
 */
const disableScroll = (ignore: string) => {
    scrollEvents = scrollEvents.map(event => {
        const callback = preventDefault(ignore);
        window.addEventListener(event.name, callback, { passive: false });
        return {
            ...event,
            callback
        };
    });
    window.addEventListener("keydown", preventDefaultForScrollKeys);
};
/**
 * @ignore
 */
const enableScroll = () => {
    scrollEvents = scrollEvents.map(event => {
        window.removeEventListener(event.name, event.callback);
        return {
            ...event,
            callback: null
        };
    });
    window.removeEventListener("keydown", preventDefaultForScrollKeys);
};

/**
 * A Component to show all registered shortcut in the app
 * it is shown as a modal
 */
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
export class KeyboardShortcutsHelpComponent implements OnInit, OnDestroy {
    /**
     * Disable scrolling while modal is open
     */
    @Input() disableScrolling = true;
    /**
     * @ignore
     */
    private _key: string;

    public className = "help-modal";

    /**
     * A description that will be shown in the help menu.
     * MUST almost provide a label for the key to be shown
     * in the help menu
     */
    @Input() keyDescription: string;

    /**
     * The label to group by the help menu toggle shortcut.
     * must provide a description for the key to show
     * in the help menu
     */
    @Input() keyLabel: string;

    /**
     * The shortcut to show/hide the help screen
     */
    @Input()
    set key(value: string) {
        this._key = value;
        if (!value) {
            return;
        }
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }
        this.clearIds = this.addShortcut({
            key: value,
            preventDefault: true,
            command: () => this.toggle(),
            description: this.keyDescription,
            label: this.keyLabel
        })
        this.clearIds = this.keyboard.add({
            key: value,
            preventDefault: true,
            command: () => this.toggle()
        });
    }

    private addShortcut(shortcut: Shortcut) {
        return this.keyboard.add(shortcut);
    }
    private _closeKey;
    @Input()
    set closeKey(value: string) {
        this._closeKey = value;
        if (!value) {
            return;
        }
        if (this.closeKeyIds) {
            this.keyboard.remove(this.closeKeyIds);
        }
        this.closeKeyIds = this.keyboard.add({
            key: value,
            preventDefault: true,
            command: () => this.hide()
        });
    }

    /**
     * The title of the help screen
     * @default: "Keyboard shortcuts"
     */
    @Input() title = "Keyboard shortcuts";
    /**
     * What message to show when no shortcuts are available on the page.
     * @default "No shortcuts available"
     */
    @Input() emptyMessage = "No shortcuts available";
    /**
     * @ignore
     */
    @ViewChild(TemplateRef) template: TemplateRef<any>;
    /**
     * @ignore
     */
    shortcuts: { label: string; key: string | string[]; description: string }[];
    /**
     * @ignore
     */
    showing = false;
    /**
     * @ignore
     */
    labels: string[];
    /**
     * @ignore
     */
    private bodyPortalHost: DomPortalOutlet;
    /**
     * @ignore
     */
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private keyboard: KeyboardShortcutsService,
        private element: ElementRef,
        private keyboardHelp: KeyboardShortcutsHelpService,
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

    /**
     * Reveal the help screen manually.
     */
    reveal(): KeyboardShortcutsHelpComponent {
        this.hide();
        if (this.disableScrolling) {
            disableScroll(`.${this.className}`);
        }
        const portal = new TemplatePortal(this.template, this.viewContainer);
        this.bodyPortalHost.attach(portal);
        this.showing = true;
        return this;
    }

    /**
     * Check if help screen is visible.
     * @returns boolean
     */
    visible(): boolean {
        return this.bodyPortalHost.hasAttached();
    }
    /**
     * Hide the help screen manually.
     */
    hide(): KeyboardShortcutsHelpComponent {
        if (this.disableScrolling) {
            enableScroll();
        }
        if (!this.bodyPortalHost.hasAttached()) {
            return this;
        }
        this.bodyPortalHost.detach();
        this.showing = false;
        return this;
    }

    /**
     * @ignore
     */
    ngOnDestroy(): void {
        this.hide();
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }
        if (this.closeKeyIds) {
            this.keyboard.remove(this.closeKeyIds);
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    /**
     * Show/Hide the help screen manually.
     */
    toggle(): KeyboardShortcutsHelpComponent {
        this.visible() ? this.hide() : this.reveal();
        return this;
    }

    /**
     * @ignore
     */
    private subscription: SubscriptionLike;
    /**
     * @ignore
     */
    private clearIds;

    /**
     * @ignore
     */
    private closeKeyIds;
    /**
     * @ignore
     */
    private timeoutId;
    /**
     * @ignore
     */
    ngOnInit() {
        this.subscription = this.keyboardHelp.shortcuts$
            .pipe(
                distinctUntilChanged(),
                map(shortcuts => groupBy(shortcuts, "label"))
            )
            .subscribe(shortcuts => {
                this.shortcuts = shortcuts;
                this.labels = Object.keys(shortcuts);
            });
    }
}
