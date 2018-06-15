import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import { ShortcutEventOutput } from 'ng-keyboard-shortcuts';
import { scan } from "rxjs/operators";
import { ShortcutInput } from "ng-keyboard-shortcuts/lib/ng-keyboard-shortcuts.interfaces";


@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
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
export class AppComponent implements AfterViewInit{

  private html;

  ngAfterViewInit(): void {
    this.shortcuts.push(
      {
        key: "ctrl + shift + g",
        command: (output: ShortcutEventOutput) => this.pressed = output.key
      },
      {
        key: "g",
        command: (output: ShortcutEventOutput) => this.pressed = output.key
      },
      {
        key: "ctrl + shift + f",
        command: (output: ShortcutEventOutput) => this.pressed = output.key
      },
      {
        key: "cmd + shift + f",
        command: (output: ShortcutEventOutput) => this.input.nativeElement.value = this.pressed = output.key ,
        preventDefault: true,
        throttleTime: 250,
        target: this.input.nativeElement
      },
      {
        key: "cmd + =",
        command: (output: ShortcutEventOutput) => this.pressed = output.key,
        preventDefault: true
      },
      {
        key: "cmd + f",
        command: (output: ShortcutEventOutput) => this.pressed = output.key,
        preventDefault: true
      }
    );
    this.keyboard.add(this.shortcuts);
    this.html = this.keyboard.pressed$
      .pipe(
        scan((acc, event: ShortcutEventOutput) => `<div>${event.key}</div>${acc}`, '')
      )

  }

  pressed: string | string[];

  @ViewChild('input') private input: ElementRef;

  shortcuts : ShortcutInput[] = [];

  constructor(private keyboard: KeyboardShortcutsService, private renderer: Renderer2) {
  }
}
