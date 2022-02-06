# ng-keyboard-shortcuts
<p>
      <a href="https://badge.fury.io/js/@egoistdeveloper%2Fng-keyboard-shortcuts" alt="npm version" target="_blank">
        <img src="https://badge.fury.io/js/@egoistdeveloper%2Fng-keyboard-shortcuts.svg" />
      </a>
      <a href="https://badge.fury.io/js/@egoistdeveloper%2Fng-keyboard-shortcuts" alt="npm downloads per month" target="_blank">
        <img src="https://img.shields.io/npm/dw/@egoistdeveloper%2Fng-keyboard-shortcuts" />
      </a>
      <a href="https://bundlephobia.com/result?p=@egoistdeveloper%2Fng-keyboard-shortcuts" alt="Bundle size" target="_blank" >
        <img src="https://img.shields.io/bundlephobia/minzip/@egoistdeveloper%2Fng-keyboard-shortcuts" />
      </a>
      <a href="https://gitter.im/ng-keyboard-shortcuts/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge" alt="Join the chat at our community" target="_blank">
        <img src="https://badges.gitter.im/ng-keyboard-shortcuts/community.svg" />
      </a>
       <a href="https://img.shields.io/npm/l/ng-keyboard-shortcuts" target="_blank" alt="MIT License">
        <img src="https://img.shields.io/npm/l/ng-keyboard-shortcuts" />
      </a>
</p>
  
An Angular module that provides a declarative API using components/directive to manage Keyboard shortcuts in scalable way.

## [Demo](https://codesandbox.io/s/yvyovny43v)

## Important notes

-  This project forked from **[omridevk/ng-keyboard-shortcuts](https://github.com/omridevk/ng-keyboard-shortcuts)** to support new angular versions and fix known bugs.
- Recommending to update to version **7.0.0 and above** and use the new component API which has better memory management than previous version.


This documentation is for Angular version **v7-13**. For older versions (**2.0.0/6.0.0**) please [click here](https://github.com/omridevk/ng-keyboard-shortcuts/tree/2.0.0)

## Migrating from `ng-keyboard-shortcuts`.

First, install `@egoistdeveloper/ng-keyboard-shortcuts` package then replace importing namespaces with again `@egoistdeveloper/ng-keyboard-shortcuts`.

## Table of contents

- [ng-keyboard-shortcuts](#ng-keyboard-shortcuts)
  - [Demo](#demo)
  - [Important notes](#important-notes)
  - [Migrating from `ng-keyboard-shortcuts`.](#migrating-from-ng-keyboard-shortcuts)
  - [Table of contents](#table-of-contents)
  - [Install:](#install)
    - [NPM](#npm)
      - [Angular latest](#angular-latest)
      - [Angular 10, 11, 12, 13](#angular-10-11-12-13)
      - [Angular 8/9](#angular-89)
      - [Angular 7](#angular-7)
  - [Yarn](#yarn)
      - [Angular latest](#angular-latest-1)
      - [Angular 8/9](#angular-89-1)
      - [Angular 7](#angular-7-1)
- [Setup](#setup)
- [Usage](#usage)
  - [Combinations](#combinations)
    - [Examples](#examples)
  - [Sequences](#sequences)
    - [__Important note__](#important-note)
    - [Examples](#examples-1)
  - [Components](#components)
    - [ng-keyboard-shortcuts](#ng-keyboard-shortcuts-1)
    - [Inputs](#inputs)
    - [Methods:](#methods)
    - [ng-keyboard-shortcuts-help](#ng-keyboard-shortcuts-help)
    - [Inputs](#inputs-1)
    - [Methods](#methods-1)
      - [Methods:](#methods-2)
  - [Directive](#directive)
    - [ngKeyboardShortcuts](#ngkeyboardshortcuts)
    - [Important](#important)
    - [Inputs](#inputs-2)
    - [Example](#example)
- [Service](#service)
  - [KeyboardShortcutsHelpService](#keyboardshortcutshelpservice)
  - [KeyboardShortcutsSelectService](#keyboardshortcutsselectservice)
- [API](#api)
  - [Types](#types)
    - [AllowIn](#allowin)
    - [Shortcut](#shortcut)
    - [ShortcutInput](#shortcutinput)
    - [ShortcutEventOutput](#shortcuteventoutput)
  - [Duplicated items in help menu](#duplicated-items-in-help-menu)
- [Building](#building)
- [Publishing on NPM](#publishing-on-npm)
- [Loading as dependency on localhost](#loading-as-dependency-on-localhost)
- [License](#license)


## Install:

### NPM
#### Angular latest
```npm i @egoistdeveloper/ng-keyboard-shortcuts@latest --save```
#### Angular 10, 11, 12, 13
```npm i @egoistdeveloper/ng-keyboard-shortcuts@^13.0.0 --save```
#### Angular 8/9
```npm i @egoistdeveloper/ng-keyboard-shortcuts@^9.0.0 --save```
#### Angular 7
```npm i @egoistdeveloper/ng-keyboard-shortcuts@^7.0.0 --save```

## Yarn

*(current version is still not published on yarn)*

#### Angular latest
```yarn add ng-keyboard-shortcuts@^10.0.0```
#### Angular 8/9
```npm add ng-keyboard-shortcuts@^9.0.0```
#### Angular 7
```yarn add ng-keyboard-shortcuts@^7.0.0```

# Setup

```typescript  
import { KeyboardShortcutsModule } from "@egoistdeveloper/ng-keyboard-shortcuts";

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
    // ...
}
```

# Usage

## Combinations

key combinations are used with meta keys like control, shift, command, etc... and are defined using plus(+) sign as a separator.
there can be multiple combinations for the same command, so either of the key combination will trigger the callback.
Since combinations uses the plus sign as a seperator, if you want to bind to the actual + charachater,
you will need to use "plus" instead.

### Examples

```typescript
   [
       {
            key: ["cmd + a"],
            command: (output: ShortcutEventOutput) => console.log("command + a", output),
        },
        {
            key: "ctrl + a",
            preventDefault: true,
            command: (output: ShortcutEventOutput) => console.log("control + a", output),
        },
        {
            key: "ctrl + plus",
            preventDefault: true,
            command: (output: ShortcutEventOutput) => console.log("control + plus key", output),
        }
    ]
```

## Sequences

Sequences can be used to support gmail like actions where you click "g" then "a", or "g" then "o" to perform certain actions.

### __Important note__

The library can get very confused if you have a single key handler that uses the same key that a sequence starts with. 
This is because it can't tell if you are starting the sequence or if you are pressing that key on its own.

To counter this, there is a __500ms__ delay(__only__ when single key is used in the beginning of another sequence, so it won't affect performance)
. This gives the library time to wait for a more complete sequence, otherwise the single sequence will be triggered.

for example: binding both "? a" and "?", then clicking "?" will trigger the "?" callback, but only after 500ms delay.
However, in all other cases there's no delay in execution of the callback (unless debounceTime is provided)


### Examples

This library supports gmail style sequences:
```typescript
   [{
        key: ["g a"],
        command: (output: ShortcutEventOutput) => console.log("? a", output),
    }]
```

konami code:
```typescript
    [{
         key: ["up up down down left right left right b a enter"],
         label: "Sequences",
         description: "Konami code!",
         command: (output: ShortcutEventOutput) => console.log("Konami code!!!", output),
    }]
```

Sequences can be used inside components or directives and are declared __without__ the plus(+) sign, for example: ``` key: ["a b c"] ``` will require clicking, a, then b, then c.

## Components

### ng-keyboard-shortcuts

Component that can be used across the app to bind to various shortcuts

### Inputs

| Name     |     Type      |      Default     |  Description  |
|----------|:-------------:|-----------------:|:-------------:|
| shortcuts |  ```ShortcutInput``` / ```ShortcutInput[]``` | [] | List of shortcut inputs types see [types](#ShortcutInput) |
| disabled |    `boolean`  |   `false`   | disable the shortcuts for the component |

### Methods:

| Name  | Input | Return  | Description |
|----------|:------|:------:|:-------------:|
| select | `string` - key to listen to events (example: `'cmd + e'`) | `Observable<ShortcutEventOutput>` |Listen to specific key events (**will only work for registered keys**) |

```typescript
  
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ShortcutInput, ShortcutEventOutput, KeyboardShortcutsComponent } from "@egoistdeveloper/ng-keyboard-shortcuts";

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
                key: ["? a"],
                label: "Sequences",
                description: "Sequence ? and a",
                command: (output: ShortcutEventOutput) => console.log("? a", output),
                preventDefault: true
            },
            {
                key: ["up up down down left right left right b a enter"],
                label: "Sequences",
                description: "Konami code!",
                command: (output: ShortcutEventOutput) => console.log("Konami code!!!", output),
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

### Inputs

|   Name   |      Type     |     default      |  description  |
|----------|:-------------:|-----------------:|:-------------:|
| key |  ```string``` | none | The key to show/hide the help modal
| keyDescription |  ```string``` | none | Description to show in the menu shortcut list for the toggle shortcut
| keyLabel |  ```string``` | none | Label that can be used to group shortcuts together in the help menu
| closeKey |  ```string``` | none | Close key to be used to close the modal
| closeKeyDescription |  ```string``` | none | Description to show in the menu shortcut list for closing the modal shortcut
| closeKeyLabel |  ```string``` | none | Label that can be used to group shortcuts together in the help menu
| title |  ```string``` | "Keyboard shortcuts" | The title of the help screen
| emptyMessage |  ```string``` | "No shortcuts available" | What message to show when no commands are registered when help modal is opened.
| disableScrolling |  ```boolean``` | true | Whether to disable body scrolling when modal help screen is opened.

### Methods

|   Name   | Input | Return |  Description  |
|----------|:------|:------:|:-------------:|
| hide | void| ```KeyboardShortcutsHelpComponent``` | Programmatically hide the modal |
| reveal | void| ```KeyboardShortcutsHelpComponent``` | Programmatically hide the modal |
| visible | void| ```boolean``` | Check whether the modal is visible or not. |
| toggle | void| ```KeyboardShortcutsHelpComponent``` | Programmatically toggle the modal visibility |

#### Methods:
|   Name   | Input | Return |  Description  |
|----------|:------|:------:|:-------------:|
| select | `string` - key to listen to events (example: `'cmd + e'`) | `Observable<ShortcutEventOutput>` | Listen to specific key events (**will only work for registered keys**) |

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

   <ng-keyboard-shortcuts-help [key]="'f1'" [closeKey]="'escape'" [title]="'Help'"></ng-keyboard-shortcuts-help>
</div>
```

## Directive

### ngKeyboardShortcuts

Directive can only be used for focusable elements, such as textarea, select, input, etc...

### Important

The shortcut then will only be active while the element is in __focus__.


### Inputs

|   Name   |      Type     |      Default     |  Description  |
|----------|:-------------:|-----------------:|:-------------:|
| ngKeyboardShortcuts |  ```Shortcut``` / ```Shortcut``` | [] | List of shortcuts see [types](#shortcut) |
| disabled |    `boolean`  |   `false`   | disable the shortcuts for the directive | 
| disableScrolling | `boolean` | `true` | disable body scrolling while modal is open |

### Example 

```typescript  
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";  
import { ShortcutInput, ShortcutEventOutput, KeyboardShortcutsComponent } from "@egoistdeveloper/ng-keyboard-shortcuts";

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

# Service

## KeyboardShortcutsHelpService
  
Singleton service that can be used to render a custom help screen. (used to build the [Built in help component](#ng-keyboard-shortcuts-help))  
Provides access to all registered shortcuts in the app using Observable that updates on shortcuts changes.  
Since shortcuts can be added or removed during the lifecycle of the app, an observable data structure needed to be used.

| Properties |   Type    |  Description  |
|------------|:---------:|:-------------:|
| shortcuts$ | ```Observable<{ key: string, label: string, description: string }[]>```| Array of registered shortcuts across the whole app |
 
## KeyboardShortcutsSelectService

A singleton service that can be used globally to listen to any registered shortcut:
| Name  | Input | Return  | Description |
|----------|:------|:------:|:-------------:|
| select | `string` - key to listen to events (example: `'cmd + e'`) | `Observable<ShortcutEventOutput>` |Listen to specific key events (**will only work for registered keys**) |
 
# API

## Types

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

## Duplicated items in help menu

Sometimes shortcuts can be loaded twice and these shortcuts show twice in the help menu. This is probably about your logic or app lifecycles.

To prevent that use `time()` method with `rxjs` or use `setTimeout`.

```typescript
timer().subscribe(() => {
  // bind your shortcuts
});

// or

setTimeout(() => {
  // bind your shortcuts
}, 100);
```

# Building

`ng build` or `npm run build` or `npm run build:prod`

# Publishing on NPM

If you want to publish as own package change package name etc in `projects/ng-keyboard-shortcuts/package.json`

1. `npm run build:prod`
2. `npm publish dist/ng-keyboard-shortcuts` (*you need login before publish*)

# Loading as dependency on localhost

1. `npm run package`
2. Copy `x-ng-keyboard-shortcuts-{version}.tgz` file in dist folder
3. In your project folder open terminal and run `npm i full/path/to/x-ng-keyboard-shortcuts-{version}.tgz`
4. Rebuild your project and see magic

# License
  
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
