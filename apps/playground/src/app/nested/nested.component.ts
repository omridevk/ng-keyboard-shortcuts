import {Component, OnInit, ChangeDetectionStrategy, AfterViewInit} from '@angular/core';
import {ShortcutInput} from '@ng-keyboard-shortcuts/ng-keyboard-shortcuts';

@Component({
    selector: "ng-keyboard-shortcuts-nested",
    templateUrl: "./nested.component.html",
    styleUrls: ["./nested.component.scss"]
})
export class NestedComponent implements OnInit, AfterViewInit {
    constructor() {}

    ngOnInit(): void {}
    title = "Angular Router Demo";
    shortcuts: ShortcutInput[] = [];

    persons = [{ name: "test" }, { name: "test" }, { name: "test" }, { name: "test" }];
    selectedIndex = 0;
    disabledShortcuts = false;

    ngAfterViewInit() {
        this.shortcuts.push(
            {
                key: ["cmd + g"],
                label: "Help",
                description: "Command + G",
                command: (e) => console.log(e),
                preventDefault: true
            },
            {
                key: ["up"],
                command: (e) => {
                    console.log("up");
                    if (this.selectedIndex > 0) this.selectedIndex--;
                },
                preventDefault: true
            },
            {
                key: ["down"],
                command: (e) => {
                    console.log("down");
                    console.log(this.selectedIndex);
                    if (this.selectedIndex < this.persons.length - 1) this.selectedIndex++;
                },
                preventDefault: true
            }
        );
    }

    disable() {
        this.disabledShortcuts = !this.disabledShortcuts;
    }
}
