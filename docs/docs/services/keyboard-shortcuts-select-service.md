---
id: keyboard-shortcuts-select-service
title: Keyboard Shortcuts select service
sidebar_position: 1
---

A singleton service that can be used globally to listen to any registered shortcut:

| Name  | Input | Return  | Description |  
|----------|:------|:------:|:-------------:|  
| select | `string` - key to listen to events (example: `'cmd + e'`) | `Observable<ShortcutEventOutput>` |Listen to specific key events (**will only work for registered keys**) |  
