import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ShortcutInput } from "ng-keyboard-shortcuts";
import { KeyboardShortcutsComponent } from "ng-keyboard-shortcuts";
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
            description: "ctrl + t",
            label: "help",
            command: () => console.log("control + t clicked")
        }
    ];

    shortcutsDisabled = false;

    @ViewChild(KeyboardShortcutsComponent, { static: true }) keyboard: KeyboardShortcutsComponent;

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
