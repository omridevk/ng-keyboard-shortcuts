import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AllowIn, KeyboardShortcutsComponent, ShortcutEventOutput, ShortcutInput } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

    shortcuts: ShortcutInput[] = [];
    @ViewChild('input') input: ElementRef;

    ngAfterViewInit(): void {
        this.shortcuts.push(
            {
                key: "ctrl + t",
                preventDefault: true,
                allowIn: [AllowIn.Textarea],
                command: e => console.log("clicked " , e.key)
            },
            {
                key: "F1",
                preventDefault: true,
                allowIn: [AllowIn.Textarea],
                command: e => console.log("clicked " , e.key)
            },
            {
                key: "cmd + shift + f",
                command: (output: ShortcutEventOutput) => console.log(output),
                preventDefault: true,
                throttleTime: 250,
                target: this.input.nativeElement
            },
            {
                key: "cmd + =",
                command: (output: ShortcutEventOutput) => console.log(output),
                preventDefault: true
            },
            {
                key: "cmd + f",
                allowIn: [AllowIn.Input],
                command: (output: ShortcutEventOutput) => console.log(output),
                preventDefault: true
            }
        );

        this.keyboard.select("cmd + f").subscribe(e => console.log(e));
    }

    @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;

    constructor() {}

    ngOnInit(): void {
    }

}