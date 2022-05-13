---
id: getting-started
title: Getting Started
sidebar_position: 1
---
<p>
      <a href="https://badge.fury.io/js/ng-keyboard-shortcuts" alt="npm version" target="_blank">
        <img src="https://badge.fury.io/js/ng-keyboard-shortcuts.svg" />
      </a>
      <a href="https://badge.fury.io/js/ng-keyboard-shortcuts" alt="npm downloads per month" target="_blank">
        <img src="https://img.shields.io/npm/dw/ng-keyboard-shortcuts" />
      </a>
      <a href="https://bundlephobia.com/result?p=ng-keyboard-shortcuts" alt="Bundle size" target="_blank" >
        <img src="https://img.shields.io/bundlephobia/minzip/ng-keyboard-shortcuts" />
      </a>
      <a href="https://gitter.im/ng-keyboard-shortcuts/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge" alt="Join the chat at our community" target="_blank">
        <img src="https://badges.gitter.im/ng-keyboard-shortcuts/community.svg" />
      </a>
       <a href="https://img.shields.io/npm/l/ng-keyboard-shortcuts" target="_blank" alt="MIT License">
        <img src="https://img.shields.io/npm/l/ng-keyboard-shortcuts" />
      </a>
</p>  

An Angular module that provides a declarative API using components/directive to manage Keyboard shortcuts in scalable way.

This documentation is for version **7.0.0+ (8,9) and any future versions**.  For older versions (**2.0.0/6.0.0**) please [click here](https://github.com/omridevk/ng-keyboard-shortcuts/tree/2.0.0)

See demo here:  
[demo](https://codesandbox.io/s/yvyovny43v)


# Install:
#### NPM
```bash
npm install --save ng-keyboard-shortcuts
```
#### Yarn
```bash
yarn add ng-keyboard-shortcuts
```

# Setup:
```typescript  
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';  
  
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
