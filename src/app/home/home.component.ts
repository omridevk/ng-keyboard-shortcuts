import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AllowIn, KeyboardShortcutsComponent, ShortcutEventOutput, ShortcutInput, ShortcutDirectiveInput} from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

    shortcuts: ShortcutInput[] = [];
    secondShortcuts: ShortcutInput[] = [];
    directiveShortcuts: ShortcutDirectiveInput[] = [];
    showSecondShortcuts = false;
    public directiveDisabled = false;
    handleClick() {
        this.directiveDisabled = !this.directiveDisabled;
    }
    toggleSecondShortcuts() {
        this.showSecondShortcuts = !this.showSecondShortcuts;
    }
    @ViewChild('input') input: ElementRef;

    ngAfterViewInit(): void {
        this.shortcuts.push(
            {
                key: "cmd + e",
                label: "help",
                description: "Controlling/Commanding + E",
                preventDefault: true,
                allowIn: [AllowIn.Textarea],
                command: e => console.log("clicked " , e.key)
            },
            {
                key: "F1",
                preventDefault: true,
                label: "help",
                description: "Open Help menu",
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
                key: "f",
                command: (output: ShortcutEventOutput) => console.log("f", output),
                preventDefault: true
            },
            {
                key: ["g e", "a b"],
                label: "Sequences",
                description: "Sequence g + e and a + b",
                command: (output: ShortcutEventOutput) => console.log("g e / a b", output),
                preventDefault: true
            },
            {
                key: ["g t"],
                label: "Sequences",
                description: "Sequence g and t",
                command: (output: ShortcutEventOutput) => console.log("g t", output),
                preventDefault: true
            },
            {
                key: ["f1 t"],
                label: "Sequences",
                description: "Sequence f1 and t",
                command: (output: ShortcutEventOutput) => console.log("f1 t", output),
                preventDefault: true
            },
            {
                key: ["? a"],
                label: "Sequences",
                description: "Sequence ? and a",
                command: (output: ShortcutEventOutput) => console.log("? a", output),
                preventDefault: true
            },
            {
                key: ["up down right"],
                label: "Sequences",
                description: "Sequence up down right",
                command: (output: ShortcutEventOutput) => console.log("up down right", output),
                preventDefault: true
            },
            {
                key: "c b a",
                label: "Sequences",
                description: "Sequence c + b + a",
                command: (output: ShortcutEventOutput) => console.log("c + b + a", output),
                preventDefault: true
            },
            {
                key: "cmd + =",
                label: "help",
                description: "zoom out",
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
        this.secondShortcuts.push({
            key: ["c + a "],
            label: "Sequences",
            description: "Sequence c + a",
            allowIn: [AllowIn.Input],
            command: (output: ShortcutEventOutput) => console.log("c + a", output),
            preventDefault: true
        });
        this.directiveShortcuts.push({
            key: "cmd + e",
            label: "test",
            description: "hello world",
            command: () => console.log('directive cmd + e'),
            preventDefault: true
        });
        this.keyboard.select("cmd + f").subscribe(e => console.log(e));
    }

    @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;

    constructor() {
    }

    ngOnInit(): void {

    }

}
