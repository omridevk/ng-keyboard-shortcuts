import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { KeyboardShortcutsService } from "./ng-keyboard-shortcuts.service";
import { ShortcutInput } from "./ng-keyboard-shortcuts.interfaces";

@Component({
    selector: "ng-keyboard-shortcuts",
    template: "",
})
export class NgKeyboardShortcutsComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    /**
     * A list of shortcuts.
     * @type ShortcutInput[] | ShortcutInput
     */
    @Input() shortcuts: ShortcutInput[] | ShortcutInput = [];

    /**
     * list of registered keyboard shortcuts
     * used for clean up on NgDestroy.
     * @type string[]
     */
    private clearIds : string[] = [];


    private _disabled: boolean = false;
    /**
     * Disable all shortcuts for this component.
     * @type {boolean}
     */
    @Input() set disabled(value) {
        this._disabled = value;
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
            this.clearIds = [];
        }
        if (value) {
            return;
        }
        this.clearIds = this.keyboard.add(this.shortcuts);
    }

    constructor(
        private keyboard: KeyboardShortcutsService
    ) {}

    ngOnInit() {}

    /**
     * Select a key to listen to, will emit when the selected key is pressed.
     * @param {string} key
     * @returns {Observable<ShortcutEventOutput>}
     */
    public select(key: string) {
        return this.keyboard.select(key);
    }

    ngAfterViewInit(): void {
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.shortcuts || !changes.shortcuts.currentValue) {
            return;
        }
        if (this.clearIds) {
            this.keyboard.remove(this.clearIds);
        }
        setTimeout(() => {
            this.clearIds = this.keyboard.add(changes.shortcuts.currentValue);
        })
    }

    ngOnDestroy(): void {
        this.keyboard.remove(this.clearIds);
    }
}
