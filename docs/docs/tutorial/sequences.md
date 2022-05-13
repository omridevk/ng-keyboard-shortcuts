---
id: sequences
title: Sequences
sidebar_position: 2
---
## Sequences

Sequences can be used to support gmail like actions where you click "g" then "a", or "g" then "o" to perform certain actions.

##### __Important note__
The library can get very confused if you have a single key handler that uses the same key that a sequence starts with.
This is because it can't tell if you are starting the sequence or if you are pressing that key on its own.

To counter this, there is a __500ms__ delay(__only__ when single key is used in the beginning of another sequence, so it won't affect performance)
. This gives the library time to wait for a more complete sequence, otherwise the single sequence will be triggered.

for example: binding both "? a" and "?", then clicking "?" will trigger the "?" callback, but only after 500ms delay.
However, in all other cases there's no delay in execution of the callback (unless debounceTime is provided)


## Examples:

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

Sequences can be used inside components or directives and are declared __without__ the plus(+) sign, for example:
``` key: ["a b c"] ```
will require clicking, a, then b, then c.
