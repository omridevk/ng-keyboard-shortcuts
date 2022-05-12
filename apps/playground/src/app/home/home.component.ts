import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
    AllowIn,
    KeyboardShortcutsComponent,
    ShortcutDirectiveInput,
    ShortcutEventOutput,
    ShortcutInput
} from "@ng-keyboard-shortcuts/ng-keyboard-shortcuts";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
    shortcuts: ShortcutInput[] = [];
    secondShortcuts: ShortcutInput[] = [];
    directiveShortcuts: ShortcutDirectiveInput[] = [];
    showSecondShortcuts = false;
    public directiveDisabled = false;
    handleClick(e) {
        console.log("button clicked", { e });
        this.directiveDisabled = !this.directiveDisabled;
    }
    toggleSecondShortcuts() {
        this.showSecondShortcuts = !this.showSecondShortcuts;
    }
    testClick(event: any) {
        console.log("clicked me");
    }

    justForFun() {
        console.log("clicks works");
    }
    @ViewChild("input", { static: true }) input: ElementRef;

    ngAfterViewInit(): void {
        this.shortcuts.push(
            // {
            //     key: "cmd + e",
            //     label: "help",
            //     description: "Controlling/Commanding + E",
            //     preventDefault: true,
            //     allowIn: [AllowIn.Textarea],
            //     command: e => console.log("clicked " , e.key)
            // },
            // {
            //     key: "N",
            //     label: "help",
            //     description: "n character",
            //     preventDefault: true,
            //     command: e => console.log("clicked BIG N" , e.key)
            // },
            {
                key: "left",
                label: "label",
                description: "up clicked",
                preventDefault: true,
                target: this.input.nativeElement,
                command: ({ key }) => console.log(`${key} clicked`)
            },
            {
                key: "e",
                label: "Global shortcuts",
                description: "Open my custom page",
                preventDefault: true,
                command: ({ key }) => console.log(`${key} clicked`)
            },
            {
                key: "cmd + e",
                label: "Global shortcuts",
                description: "Open my custom page",
                command: ({ key, event }) => console.log(`${key} clicked.`, event)
            },
            {
                key: "ctrl + e",
                label: "Global shortcuts",
                description: "Open my custom page",
                command: ({ key }) => console.log(`${key} clicked `)
            },
            {
                key: "space",
                label: "label",
                description: "play/pause",
                preventDefault: true,
                command: ({ key }) => console.log(`${key} clicked`)
            },
            {
                key: "plus",
                label: "help",
                description: "clicking plus character",
                preventDefault: true,
                command: ({ key, event }) => console.log(`${key} clicked`, event)
            },
            {
                key: "control + plus",
                label: "help",
                description: "clicking control with plus character",
                preventDefault: true,
                command: ({ key, event }) => console.log(`${key} clicked`, event)
            },
            {
                key: "=",
                label: "help",
                description: "clicking = character",
                preventDefault: true,
                command: ({ key, event }) => console.log(`${key} clicked`, event)
            },
            {
                key: "ctrl + ע",
                label: "help",
                description: "Hebrew letters",
                preventDefault: true,
                command: ({ key, event }) => console.log(`${key} clicked`, event)
            },
            {
                key: "n",
                label: "help",
                description: "n character",
                preventDefault: true,
                command: ({ key, event }) => console.log(`${key} clicked`, event)
            },
            {
                key: "ctrl + shift + n",
                label: "help",
                description: "shift + n",
                preventDefault: true,
                command: ({ key, event }) => console.log(`${key} clicked`, event)
            },
            {
                key: "N",
                label: "help",
                description: "big N",
                preventDefault: true,
                command: ({ key, event }) => console.log(`${key} clicked`, event)
            },
            {
                key: "~",
                label: "help",
                description: "~ sign",
                preventDefault: true,
                allowIn: [AllowIn.Textarea, AllowIn.Input, AllowIn.Select],
                command: ({ key, event }) => console.log(`${key} clicked`, event)
            },
            {
                key: "?",
                label: "help",
                description: "Question mark",
                preventDefault: true,
                command: ({ key, event }) =>
                    console.log(`${key} allow in all fields clicked`, event)
            },
            {
                key: "ctrl + ?",
                label: "help",
                description: "Shift + Question mark",
                preventDefault: true,
                allowIn: [AllowIn.Textarea, AllowIn.Input, AllowIn.Select],
                command: ({ key, event }) =>
                    console.log(`${key} allow in all fields clicked`, event)
            },
            {
                key: "f2",
                preventDefault: true,
                label: "help",
                description: "Open Help menu",
                allowIn: [AllowIn.Textarea],
                command: ({ key, event }) =>
                    console.log(`${key} allowed in text area clicked`, event)
            },
            {
                key: "cmd + ?",
                command: ({ key, event }) =>
                    console.log(`${key} clicked with 250 throttle time`, event),
                preventDefault: true,
                throttleTime: 250
            },
            {
                key: "shift + f",
                command: ({ key, event }) => console.log(`${key} clicked`, event),
                preventDefault: true
            },
            {
                key: ["g e", "a b"],
                label: "Sequences",
                description: "Sequence g + e and a + b",
                command: ({ key, event }) => console.log(`${key} clicked`, event),
                preventDefault: true
            },
            {
                key: ["g t"],
                label: "Sequences",
                description: "Sequence g and t",
                command: ({ key, event }) => console.log(`${key} clicked`, event),
                preventDefault: true
            },
            {
                key: ["f1 t"],
                label: "Sequences",
                description: "Sequence f1 and t",
                command: ({ key, event }) => console.log(`${key} clicked`, event),
                preventDefault: true
            },
            {
                key: ["? a"],
                label: "Sequences",
                description: "Sequence ? and a",
                command: ({ key, event }) => console.log(`${key} clicked`, event),
                preventDefault: true
            },
            {
                key: ["up up down down left right left right b a enter"],
                label: "Sequences",
                description: "Konami code!",
                command: ({ key, event }) => console.log(`${key} clicked`, event),
                preventDefault: true
            },
            {
                key: "c b a",
                label: "Sequences",
                description: "Sequence c + b + a",
                command: ({ key, event }) => console.log(`${key} clicked`, event),
                preventDefault: true
            },
            {
                key: "cmd + plus",
                label: "help",
                description: "zoom out",
                command: ({ key, event }) => console.log(`${key} clicked`, event),
                preventDefault: true
            },
            {
                key: "cmd + shift + f",
                command: ({ key, event }) => console.log(`${key} clicked`, event),
                preventDefault: true,
                throttleTime: 250
            },
            {
                key: "cmd + f",
                allowIn: [AllowIn.Input],
                command: ({ key, event }) => console.log(`${key} allow in input clicked`, event),
                preventDefault: true
            }
        );
        this.secondShortcuts.push({
            key: ["c + a"],
            label: "Sequences",
            description: "Sequence c + a",
            allowIn: [AllowIn.Input],
            command: (output: ShortcutEventOutput) => console.log("c + a", output),
            preventDefault: true
        });
        this.directiveShortcuts.push({
            key: "ctrl + a",
            label: "test",
            description: "only works inside the element",
            command: () => console.log("directive ctrl + a"),
            preventDefault: true
        });
        this.keyboard.select("cmd + f").subscribe((e) => console.log(e));
    }

    @ViewChild(KeyboardShortcutsComponent)
    private keyboard: KeyboardShortcutsComponent;

    constructor() {}

    ngOnInit(): void {}
}
