# ng-keyboard-shortcuts

An angular module that exposes a service for creating keyboard shortcuts using a simple configuration object like Visual Studio Code key bindings.

Compatible with Angular 6+

### Download:

npm install --save ng-keyboard-shortcuts


## Getting Started:

### Import:
```typescript
import { KeyboardShortcutsModule }     from 'ng-keyboard-shortcuts';


@NgModule({
    declarations: [
    ],
    imports: [
        BrowserModule,
        FormsModule,
        KeyboardShortcutsModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```



### Using the service:

Add the service to the providers array [Angular DI](https://angular.io/guide/hierarchical-dependency-injection)

Add shortcuts by calling the service ```add``` method and providing it with a Shortcut type (or array of shortcuts):
``` { key: "ctrl + shift + g", command: (event) => console.log(event) } ```

Example:
```typescript
@Component({
    selector: 'demo-component',
    template: "<h2> new component </h2>"
    providers: [ KeyboardShortcutsService ]
})
export class DemoComponent implements OnInit {

      constructor(private keyboard: KeyboardShortcutsService, private element: ElementRef) {
           const target = this.element.nativeElement.querySelector(".demo-input");
           this.keyboard.add([
                {
                    key: 'ctrl f',
                    command: () => console.log('ctrl + f')
                },
                {
                    key: 'ctrl shift f',
                    command: () => console.log('ctrl + shift + f'),
                    target: target
                },
                {
                    key: 'cmd f',
                    command: () => console.log('cmd + f'),
                    preventDefault: true
                }
            ]);


            this.keyboard.add({
                  key: ['cmd + shift + g', 'cmd + g'],
                  command: ({event, key}) => console.log(key, event)
            })
      }

}
```

### API:

#### Types:
```typescript
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
  allowIn?: string[] ("TEXTAREA" | "SELECT" | "INPUT");

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



#### Classes:
```typescript
KeyboardShortcutsService class:

    /**
    * Add new shortcut/s
    * Accept either array of Shortcuts or single Shortcut object.
    * when instance of a component is provided the shortcuts will be removed when the component is destroyed(make sure to define ngOnDestroy otherwise angular won't call it)
    * @param {Shortcut[] | Shortcut} shortcuts
    * @param {any} instance(Optional) - the instance of component, will be used for cleanup by the service **make sure to add ngOnDestroy**.
    * @returns {KeyboardShortcutsService}
    */
    add(shortcuts: ShortcutInput[], instance?: any): KeyboardShortcutsService;

    /**
     * remove a keyboard shortcut can be used for manual cleanup.
     */
    remove(keys: string | string[]): KeyboardShortcutsService

    /**
     * disable all keyboard shortcuts
     */
    disable(): KeyboardShortcutsService

    /**
     * enable all keyboard shortcuts
     */
    enable(): KeyboardShortcutsService


```


## Building/Publishing

1. ```npm run build-lib```
2. ```npm publish dist/ng-keyboard-shortcuts```