import {
    ApplicationRef,
    Component,
    ComponentFactoryResolver,
    Injector,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import { DomPortalOutlet } from "./dom-portal-outlet";
import { TemplatePortal } from "./portal";
import { KeyboardShortcutsService } from "./ng-keyboard-shortcuts.service";
import { NgKeyboardShortcutsHelpService } from "./ng-keyboard-shortcuts-help.service";
import { animate, style, transition, trigger } from '@angular/animations';
import { distinctUntilChanged, groupBy, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';

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
                    "0.13s cubic-bezier(0,0,0.3,1)",
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
export class NgKeyboardShortcutsHelpComponent implements OnInit {
    @Input() attachToBody = true;
    @Input() key: string;

    @ViewChild(TemplateRef) template: TemplateRef<any>;

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
    handleModalBodyClicked(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    reveal() {
        this.hide();

        const portal = new TemplatePortal(this.template, this.viewContainer);
        this.bodyPortalHost.attach(portal);
    }

    visible() {
        return this.bodyPortalHost.hasAttached();
    }

    hide() {
        if (!this.bodyPortalHost.hasAttached()) {
            return;
        }
        this.bodyPortalHost.detach();
    }
    ngOnDestroy(): void {
        this.hide();
    }
    toggle() {
      this.visible() ? this.hide() : this.reveal();
    }

    ngOnInit() {
        this.keyboardHelp.shortcuts$.pipe(
            distinctUntilChanged(),
            switchMap(shortcuts => from(shortcuts)),
            groupBy(shortcut => shortcut.label),
            tap(e => console.log(e)),
            mergeMap(group => group.pipe(toArray()))
        ).subscribe(e => console.log(e));

        this.keyboard.add({
            key: this.key,
            preventDefault: true,
            command: () => this.toggle()
        });
    }
}
