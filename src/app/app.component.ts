import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { KeyboardShortcutsService } from "ng-keyboard-shortcuts";
import { ShortcutEventOutput } from "ng-keyboard-shortcuts";
import { scan } from "rxjs/operators";
import { ShortcutInput } from "ng-keyboard-shortcuts/lib/ng-keyboard-shortcuts.interfaces";
import { fromEvent, merge, Subject } from "rxjs";
import { MatButton } from "@angular/material";

@Component({
    selector: "demo-app",
    templateUrl: "./app.component.html",
    styles: [
        `
      .wrapper {
        display: flex;
        align-items: center;
        min-height: 24em;
        justify-content: center;
      }
      .example-card {
        max-width: 1170px;
      }
      .selected {
        font-weight: bold;
      }
    `
    ]
})
export class AppComponent implements AfterViewInit {
    private html$;

    private _clear = new Subject();
    private clear$ = this._clear.asObservable();

    ngAfterViewInit(): void {
        this.shortcuts.push(
            {
                key: "ctrl + shift + g",
                command: (output: ShortcutEventOutput) => (this.pressed = output.key)
            },
            {
                key: "g",
                command: (output: ShortcutEventOutput) => (this.pressed = output.key)
            },
            {
                key: "ctrl + shift + f",
                command: (output: ShortcutEventOutput) => (this.pressed = output.key)
            },
            {
                key: "cmd + t",
                preventDefault: true,
                command: e => console.log("clicked " , e.key)
            },
            {
                key: "cmd + shift + f",
                command: (output: ShortcutEventOutput) =>
                    (this.input.nativeElement.value = this.pressed = output.key),
                preventDefault: true,
                throttleTime: 250,
                target: this.input.nativeElement
            },
            {
                key: "cmd + =",
                command: (output: ShortcutEventOutput) => (this.pressed = output.key),
                preventDefault: true
            },
            {
                key: "cmd + f",
                command: (output: ShortcutEventOutput) => {
                    this.pressed = output.key;
                    this._clear.next();
                },
                preventDefault: true
            }
        );
        this.keyboard.add(this.shortcuts);
        this.keyboard.add({
            key: "cmd + c",
            command: e => console.log((this.pressed = e.key)),
            preventDefault: true
        });
        const commandC$ = this.keyboard.select('cmd + c');
        const clicks$ = fromEvent(this.clearButton._getHostElement(), "click");
        this.html$ = merge(clicks$, this.clear$, this.keyboard.pressed$, commandC$).pipe(
            scan((acc, event: ShortcutEventOutput) => {
                if (!event || !event.key) {
                    return "";
                }
                return `<div>${event.key}</div>${acc}`;
            }, "")
        );
    }
    pressed: string | string[];

    @ViewChild("input") private input: ElementRef;
    @ViewChild("clear") private clearButton: MatButton;
    shortcuts: ShortcutInput[] = [];

    constructor(public keyboard: KeyboardShortcutsService) {}
}
