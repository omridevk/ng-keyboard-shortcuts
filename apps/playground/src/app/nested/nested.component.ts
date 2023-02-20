import {Component, AfterViewInit, HostListener} from '@angular/core';
import {ShortcutInput} from 'ng-keyboard-shortcuts';

@Component({
    selector: "ng-keyboard-shortcuts-nested",
    templateUrl: "./nested.component.html",
    styleUrls: ["./nested.component.scss"]
})
export class NestedComponent implements AfterViewInit {
    title = "Angular Router Demo";
    shortcuts: ShortcutInput[] = [];

    persons = [{ name: "test" }, { name: "test" }, { name: "test" }, { name: "test" }];
    selectedIndex = 0;
    disabledShortcuts = false;

    onShiftPlusKClicked(event) {
        console.log(event);
    }

    @HostListener("shortcut.t k", ['$event'])
    onShortcut(event) {
        console.log(event);
    }

    @HostListener("shortcut.shift + y.prevent")
    onShift() {
        console.log("ty")
    }

    ngAfterViewInit() {
        this.shortcuts.push(
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
