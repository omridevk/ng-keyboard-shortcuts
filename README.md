# ng-keyboard-shortcuts

An Angular module that provides a declarative API using components/directive to manage Keyboard shortcuts in scalable way.

This documentation is for version 7.0.0 for version 2.0.0 please [click here](https://github.com/omridevk/ng-keyboard-shortcuts/tree/2.0.0)


####__important note__
We recommend to update to version 7.0.0 and use the new component API which has a better memory management than previous version.

Compatible with Angular 5+


* [Install](#install)
* [Setup](#setup)
* [Usage](#usage)
    * [Components](#components)
        * [Keyboardshortcuts](#ng-keyboard-shortcuts)
        * [HelpScreen](#ng-keyboard-shortcuts-help)
    * [Directive](#directive)
        * [ngKeyboardShortcut](#ngKeyboardShortcut)
* [API](#api)
    * [Types](#types)
* [Building](#building)
* [Publishing](#publishing)
* [License](#License)


# Install:

```npm install --save ng-keyboard-shortcuts```

#####or yarn

``` yarn add ng-keyboard-shortcuts```

# Setup:
```typescript
import { KeyboardShortcutsModule }     from 'ng-keyboard-shortcuts';

@NgModule({
    declarations: [
    ],
    imports: [
        BrowserModule,
        KeyboardShortcutsModule.foRoot()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```



# Usage:


## Components:
### ng-keyboard-shortcuts
Component that can be used across the app to bind to various shortcuts

#### Inputs:
| Name   |      Type      |  default         | description |
|----------|:-------------:|-----------------:  |:-------------:|  
| shortcuts |  ```ShortcutInput``` / ```ShortcutInput[]``` | [] | List of shortcuts see [types](#types) |
| disabled |    `boolean`  |   `false`   | disable the shortcuts for the directive |
 
```typescript

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ShortcutInput, ShortcutEventOutput, KeyboardShortcutsComponent } from "ng-keyboard-shortcuts";

@Component({
    selector: 'demo-component',
    template: "<ng-keyboard-shortcuts [shortcuts]="shortcuts"></ng-keyboard-shortcut>"
})
export class DemoComponent implements AfterViewInit {

    shortcuts: ShortcutInput[] = [];
    @ViewChild('input') input: ElementRef;

    ngAfterViewInit(): void {
        this.shortcuts.push(
            {
                key: "ctrl + t",
                preventDefault: true,
                allowIn: [AllowIn.Textarea, AllowIn.Input],
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
                key: ["cmd + =", "cmd + z"],
                command: (output: ShortcutEventOutput) => console.log(output),
                preventDefault: true
            },
            {
                key: "cmd + f",
                command: (output: ShortcutEventOutput) => console.log(output),
                preventDefault: true
            }
        );

        this.keyboard.select("cmd + f").subscribe(e => console.log(e));
    }

    @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;

}
```

## Directive
### ngKeyboardShortcut
Directive can be used in either Input, Select or Textarea tags.

| Name   |      Type      |  default         | description |
|----------|:-------------:|-----------------:  |:-------------:|  
| ngKeyboardShortcut |  ```ShortcutInput``` / ```ShortcutInput[]``` | [] | List of shortcuts see [types](#types) |
| disabled |    `boolean`  |   `false`   | disable the shortcuts for the directive |

#### Inputs

```typescript
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ShortcutInput, ShortcutEventOutput, KeyboardShortcutsComponent } from "ng-keyboard-shortcuts";

@Component({
    selector: 'demo-component',
    template: "<input [ngKeyboardShortcut]="shortcuts" />"
})
export class DemoComponent implements AfterViewInit {

    shortcuts: ShortcutInput[] = [];
    @ViewChild('input') input: ElementRef;

    ngAfterViewInit(): void {
        this.shortcuts.push({
            key: "cmd + e",
            label: "test",
            description: "hello world",
            command: () => console.log('directive cmd + e'),
            preventDefault: true
        });

        this.keyboard.select("cmd + f").subscribe(e => console.log(e));
    }

    @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;

}
```

# API:

## Types:
```typescript

export enum AllowIn {
    Textarea = 'TEXTAREA',
    Input = 'INPUT',
    Select = "SELECT"
}

type ShortcutInput = {

  /**
   * key combination to trigger the command, example: "ctrl + shift + g" or ["ctrl + g", "cmd + g"]
   */
  key: string | string[],

  /**
   *  the command to be triggered, example: () => console.log('hi world')
   */
  command(event: ShortcutEventOutput): any;

  /**
   * Optional - provide a description to the command - can be used to render an help menu.
   */
  description: string - optional

  /**
   * Optional (default: 0) - provide a throttle time to each command.
   */
  throttleTime?: number;

  /**
   * By default shortcuts are disabled when INPUT, TEXTAREA or SELECT elements are in focus
   * you can override this behavior by provided an array of nodeNames to allow in. example:
   * allowIn: ["TEXTAREA", "SELECT"]
   */
  allowIn?: AllowIn;

  /**
   * Optional - provide a label to allow grouping to later on create an help menu if needed.
   */
  label?: string;

  /**
   * Optional - trigger the command only when the provided target is in focus.
   */
  target?: HTMLElement;

  /**
   * Optional - Whether to prevent browser default behavior.
   */
  preventDefault?: boolean;
}


type = ShortcutEventOutput {
    event: KeyboardEvent;
    key: string | string[];
}

```


# Building

```npm run build-lib```

# Publishing
1. ```npm run build-lib```
2. ```npm publish dist/ng-keyboard-shortcuts```

# License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
