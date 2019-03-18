import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ShortcutInput } from "ng-keyboard-shortcuts";
import { NgKeyboardShortcutsComponent } from "ng-keyboard-shortcuts";
import { Subscription } from "rxjs";

@Component({
    selector: "app-getting-started",
    templateUrl: "./getting-started.component.html",
    styleUrls: ["./getting-started.component.css"]
})
export class GettingStartedComponent implements OnInit, AfterViewInit, OnDestroy {
    shortcuts: ShortcutInput[] = [
        {
            key: "ctrl + t",
            command: () => console.log("ctron tol + t my man")
        }
    ];

    shortcutsDisabled = false;

    @ViewChild(NgKeyboardShortcutsComponent) keyboard: NgKeyboardShortcutsComponent;

    constructor() {}


    ngOnInit() {

    }
    subscriptions: Subscription[] = [];

    ngAfterViewInit(): void {
        this.subscriptions.push(this.keyboard.select('ctrl + t').subscribe(e => console.log(e)));
    }
    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
