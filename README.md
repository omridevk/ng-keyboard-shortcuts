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

      constructor(private keyboard: KeyboardShortcutsService) {
           this.keyboard.addShortcuts([
                {
                    key: 'ctrl f',
                    command: () => console.log('ctrl + f')
                },
                {
                    key: 'ctrl shift f',
                    command: () => console.log('ctrl + shift + f')
                },
                {
                    key: 'cmd f',
                    command: () => console.log('cmd + f')
                }
            ]);
      }
}
```

### API:

#### Types:
```typescript
type Shortcut = {
  key: any;
  command: Function,
  target?: HTMLElement
}
```
#### Classes:
```typescript
KeyboardShortcutsService class: 

  addShortcuts(shortcuts: Shortcuts[]): void 
```
