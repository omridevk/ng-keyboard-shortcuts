---
id: keyboard-shortcuts-help-service
title: Keyboard Shortcuts help service
sidebar_position: 1
---

Singleton service that can be used to render a custom help screen. (used to build the [Built in help component](#ng-keyboard-shortcuts-help))  
Provides access to all registered shortcuts in the app using Observable that updates on shortcuts changes.  
Since shortcuts can be added or removed during the lifecycle of the app, an observable data structure needed to be used.

| properties   |  type   | description |  
|----------|:---------:|:-------------:|  
| shortcuts$ | ```Observable<{ key: string, label: string, description: string }[]>```| Array of registered shortcuts across the whole app |  
