import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import { KeyboardEventOutput } from 'ng-keyboard-shortcuts';


@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styles: [
      `
      .selected {
        font-weight: bold;
      }
    `
  ]
})
export class AppComponent implements AfterViewInit{
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
        command: (output: KeyboardEventOutput) => this.pressed = output.key,
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
    )
    this.keyboard.add(this.shortcuts)
  }

  pressed: string;

  @ViewChild('input') private input: ElementRef;

  shortcuts = [];

  constructor(private keyboard: KeyboardShortcutsService) {
  }
}
