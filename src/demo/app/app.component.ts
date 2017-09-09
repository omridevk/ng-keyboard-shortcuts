import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import { KeyboardEventOutput } from 'ng-keyboard-shortcuts';


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
        command: (output: KeyboardEventOutput) => this.pressed = output.key
      },
      {
        key: "ctrl + shift + f",
        command: (output: KeyboardEventOutput) => this.pressed = output.key
      },
      {
        key: "cmd + shift + f",
        command: (output: KeyboardEventOutput) => this.input.nativeElement.value = this.pressed = output.key ,
        preventDefault: true,
        target: this.input.nativeElement
      },
      {
        key: "cmd + =",
        command: (output: KeyboardEventOutput) => this.pressed = output.key,
        preventDefault: true
      },
      {
        key: "cmd + f",
        command: (output: KeyboardEventOutput) => this.pressed = output.key,
        preventDefault: true
      }
    );
    this.keyboard.add(this.shortcuts)
    this.html = this.keyboard.pressed$
      .scan((acc, event) => `<div>${event.key}</div>${acc}`, '')
  }

  pressed: string;

  @ViewChild('input') private input: ElementRef;

  shortcuts = [];

  constructor(private keyboard: KeyboardShortcutsService, private renderer: Renderer2) {
  }
}
