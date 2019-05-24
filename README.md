# ng-keyboard-shortcuts
[![npm version](https://badge.fury.io/js/ng-keyboard-shortcuts.svg)](https://badge.fury.io/js/ng-keyboard-shortcuts) [![Join the chat at https://gitter.im/ng-keyboard-shortcuts/community](https://badges.gitter.im/ng-keyboard-shortcuts/community.svg)](https://gitter.im/ng-keyboard-shortcuts/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  
  
  
An Angular module that provides a declarative API using components/directive to manage Keyboard shortcuts in scalable way.  
  
This documentation is for version **^7.0.0**.  For older versions (**2.0.0/6.0.0**) please [click here](https://github.com/omridevk/ng-keyboard-shortcuts/tree/2.0.0)  
  
See demo here:  
[demo](https://codesandbox.io/s/yvyovny43v)  
  
#### important note  
We recommend to update to version **7.0.0** and use the new component API which has a better memory management than previous version.  
  
Compatible with Angular 5+  
  
  
* [Install](#install)  
* [Setup](#setup)  
* [Usage](#usage)  
    * [Components](#components)  
        * [Keyboardshortcuts](#ng-keyboard-shortcuts-1)  
        * [HelpScreen](#ng-keyboard-shortcuts-help)  
    * [Directive](#directive)  
        * [ngKeyboardShortcut](#ngKeyboardShortcut)  
    * [Service](#service)  
        * [KeyboardShortcutsHelpService](#KeyboardShortcutsHelpService)  
* [API](#api)  
    * [Types](#types)  
        * [AllowIn](#AllowIn)  
        * [Shortcut](#Shortcut)  
        * [ShortcutInput](#ShortcutInput)  
        * [ShortcutEventOutput](#ShortcutEventOutput)  
* [Building](#building)  
* [Publishing](#publishing)  
* [License](#License)  
  
  
# Install:  
  
```npm install --save ng-keyboard-shortcuts```  
  
##### or yarn  
  
``` yarn add ng-keyboard-shortcuts```  
  
# Setup:  
```typescript  
import { KeyboardShortcutsModule }     from 'ng-keyboard-shortcuts';  
  
@NgModule({  
    declarations: [  
    ],  
    imports: [  
        BrowserModule,  
        KeyboardShortcutsModule.forRoot()  
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
| Name   |      Type      |  Default         | Description |  
|----------|:-------------:|-----------------:  |:-------------:|  
| shortcuts |  ```ShortcutInput``` / ```ShortcutInput[]``` | [] | List of shortcut inputs types see [types](#ShortcutInput) |  
| disabled |    `boolean`  |   `false`   | disable the shortcuts for the component |  
  
#### Methods:  
| Name  | Input | Return  | Description |  
|----------|:------|:------:|:-------------:|  
| select | `string` - key to listen to events (example: `'cmd + e'`) | `Observable<ShortcutEventOutput>` |Listen to specific key events (**will only work for registered keys**) |  
  
  
```typescript  
  
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";  
import { ShortcutInput, ShortcutEventOutput, KeyboardShortcutsComponent } from "ng-keyboard-shortcuts";  
  
@Component({  
    selector: 'demo-component',  
    template: "<ng-keyboard-shortcuts [shortcuts]="shortcuts"></ng-keyboard-shortcuts>"  
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
### ng-keyboard-shortcuts-help  
1. **Make sure to install `@angular/animations` ( `npm install --save @angular/animations` or `yarn add @angular/animations`**  
2. **Add BrowserAnimationsModule to your app.module imports**  
  
Can be used to show an help screen ( will be attached to body and be shown as a modal)  
  
Should be placed in the root of your app, preferably in app.component.html  
  
 #### Inputs  
| Name   |      Type      |  default         | description |  
|----------|:-------------:|-----------------:  |:-------------:|  
| key |  ```string``` | none | The key to show/hide the help modal
| closeKey |  ```string``` | none | Close key to be used to close the modal
| title |  ```string``` | "Keyboard shortcuts" | The title of the help screen
| emptyMessage |  ```string``` | "No shortcuts available" | What message to show when no commands are registered when help modal is opened.
| disableScrolling |  ```boolean``` | true | Whether to disable body scrolling when modal help screen is opened.
  
 #### Methods:  
| Name  | Input | Return  | Description |  
|----------|:------|:------:|:-------------:|  
| hide | void| ```KeyboardShortcutsHelpComponent``` | Programmatically hide the modal |   
| reveal | void| ```KeyboardShortcutsHelpComponent``` | Programmatically hide the modal |
| visible | void| ```boolean``` | Check whether the modal is visible or not. |
| toggle | void| ```KeyboardShortcutsHelpComponent``` | Programmatically toggle the modal visibility |

#### Methods:  
| Name  | Input | Return  | Description |  
|----------|:------|:------:|:-------------:|  
| select | `string` - key to listen to events (example: `'cmd + e'`) | `Observable<ShortcutEventOutput>` |Listen to specific key events (**will only work for registered keys**) |  
  
`app.component.ts`  
```typescript  
import { Component } from "@angular/core";  
  
@Component({  
  selector: "app-root",  
  template: "./app.component.html",  
  styleUrls: ["./app.component.css"]  
})  
export class AppComponent {  
  title = "Hello";  
}  
  
```  
`app.component.html`  
```html  
<div style="text-align:center">  
   <h1>  
      Welcome to {{ title }}!  
   </h1>  
   <ng-keyboard-shortcuts-help [key]="'f1'" [closeKey]="'escape'" [title]="Help"></ng-keyboard-shortcut-help>  
</div>  
  
```  
  
## Directive  
### ngKeyboardShortcut  
Directive that can only be used for focusable elements, such as textarea, select, input, etc...  
  
#### Inputs  
| Name   |      Type      |  default         | description |  
|----------|:-------------:|-----------------:  |:-------------:|  
| ngKeyboardShortcut |  ```Shortcut``` / ```Shortcut``` | [] | List of shortcuts see [types](#shortcut) |  
| disabled |    `boolean`  |   `false`   | disable the shortcuts for the directive |  
| disableScrolling | `boolean` | `true` | disable body scrolling while modal is open |  
  
#### Example 
  
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
# Service  
## KeyboardShortcutsHelpService  
  
Singleton service that can be used to render a custom help screen. (used to build the [Built in help component](#ng-keyboard-shortcuts-help))  
Provides access to all registered shortcuts in the app using Observable that updates on shortcuts changes.  
Since shortcuts can be added or removed during the lifecycle of the app, an observable data structure needed to be used.  
  
| properties   |  type   | description |  
|----------|:---------:|:-------------:|  
| shortcuts$ | ```Observable<{ key: string, label: string, description: string }[]>```| Array of registered shortcuts across the whole app |  
  
# API:  
  
## Types:  
  
### AllowIn  
```typescript  
export enum AllowIn {  
    Textarea = 'TEXTAREA',  
    Input = 'INPUT',  
    Select = "SELECT"  
}  
```  
### Shortcut  
Used for Directive input  
```typescript  
export interface Shortcut {  
  
    key: string | string[];  
  
    /**  
     * callback to be called when shortcut is pressed.  
     * @param event - the event out  
     */  
    command(event: ShortcutEventOutput): any;  
  
    /**  
     * Description for the command can be used for rendering help menu.  
     */  
    description?: string;  
  
    /**  
     * How much time to throttle in ms.  
     */  
    throttleTime?: number;  
  
    /**  
     * Label, can be used for grouping commands.  
     */  
    label?: string;  
  
    /**  
     * Prevent browser default, default: false  
     */  
    preventDefault?: boolean;  
}  
```  
  
### ShortcutInput  
Used for the component as input.  
```typescript  
export interface ShortcutInput extends Shortcut {  
    /**  
     * textarea, select and input are ignored by default, this is used to override  
     * this behavior.  
     * allow in node names, accepts: ["TEXTAREA", "SELECT", "INPUT]  
     */  
    allowIn?: AllowIn[];  
    /**  
     * Only trigger the command when the target is in focus.  
     */  
    target?: HTMLElement;  
}  
```  
  
### ShortcutEventOutput  
  
```typescript  
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