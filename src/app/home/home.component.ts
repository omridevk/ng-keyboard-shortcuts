import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ShortcutInput, ShortcutEventOutput} from "ng-keyboard-shortcuts";
import { MatButton } from "@angular/material";
import { Subject } from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

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
                key: "ctrl + t",
                preventDefault: true,
                allowIn: ['TEXTAREA'],
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
    }
    pressed: string | string[];

    @ViewChild("input") private input: ElementRef;
    @ViewChild("clear") private clearButton: MatButton;
    shortcuts: ShortcutInput[] = [];

    constructor() {}

    ngOnInit(): void {
    }

}
