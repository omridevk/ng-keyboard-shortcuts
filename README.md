# ng-keyboard-shortcuts

An Angular module that provides a declarative API using components/directive to manage Keyboard shortcuts in scalable way.


Compatible with Angular 5+

### Download:

```npm install --save ng-keyboard-shortcuts```

#####or yarn

``` yarn add ng-keyboard-shortcuts```

## Getting Started:

### Import:
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



### Usage:



Example:
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

### API:

#### Types:
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


## Building/Publishing

1. ```npm run build-lib```
2. ```npm publish dist/ng-keyboard-shortcuts```


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
