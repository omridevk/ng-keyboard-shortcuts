# ng-keyboard-shortcuts

An angular module that exposes a service for creating keyboard shortcuts using a simple configuration object like Visual Studio Code key bindings.

### Download:

npm install --save ng-keyboard-shortcuts


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

Add the service to the providers array [read Angular DI](https://angular.io/guide/hierarchical-dependency-injection)

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
           this.keyboard.addShortcuts([
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
            
            
            this.keyboard.addShortcuts({
                  key: 'cmd + shift + g',
                  command: () => console.log('cmd + shift + g')
            })
      }
      
}
```

### API:

#### Types:
```typescript
type Shortcut = {
  key: string, // key combination to trigger the command, example: "ctrl + shift + g" 
  command: Function, // the command to be triggered, example: () => console.log('hi world') 
  target?: HTMLElement // if provided the command will trigger only when key event is invoked by the target,
  preventDefault: boolean // whether to preventDefault for key down browser event
}
```
#### Classes:
```typescript
KeyboardShortcutsService class: 

    /**
    * Add new shortcut/s
    * Accept either array of Shortcuts or single Shortcut object.
    * @param {Shortcut[] | Shortcut} shortcuts
    * @returns {KeyboardShortcutsService}
    */
    addShortcuts(shortcuts: Shortcuts[]): KeyboardShortcutsService;
    
    /**
    * Set throttleTime for the key down event
    * Default: 100
    * @param {number} time
    * @returns {KeyboardShortcutsService}
    */
    setThrottleTime(time: number): KeyboardShortcutsService
```
