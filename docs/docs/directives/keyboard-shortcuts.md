---
id: ngKeyboardShortcuts
title: ngKeyboardShortcuts
sidebar_position: 2
---
Directive can only be used for focusable elements, such as textarea, select, input, etc...
##### Important:
The shortcut then will only be active while the element is in __focus__.


#### Inputs
| Name   |      Type      |  default         | description |  
|----------|:-------------:|-----------------:  |:-------------:|  
| ngKeyboardShortcuts |  ```Shortcut``` / ```Shortcut``` | [] | List of shortcuts see [types](#shortcut) |  
| disabled |    `boolean`  |   `false`   | disable the shortcuts for the directive |  
| disableScrolling | `boolean` | `true` | disable body scrolling while modal is open |  

#### Example

```typescript  
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";  
import { ShortcutInput, ShortcutEventOutput, KeyboardShortcutsComponent } from "ng-keyboard-shortcuts";  
  
@Component({  
    selector: 'demo-component',  
    template: "<input [ngKeyboardShortcuts]="shortcuts" />"  
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
