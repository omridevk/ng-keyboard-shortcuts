---
id: combinations
title: Combinations
sidebar_position: 1
---

key combinations are used with meta keys like control, shift, command, etc... and are defined using plus(+) sign as a separator.
there can be multiple combinations for the same command, so either of the key combination will trigger the callback.
Since combinations uses the plus sign as a seperator, if you want to bind to the actual + charachater,
you will need to use "plus" instead.

#### Examples:

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
