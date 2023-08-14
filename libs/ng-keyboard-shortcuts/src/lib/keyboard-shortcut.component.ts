import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    AfterViewInit,
    Output,
    EventEmitter
} from '@angular/core';
import {AllowIn, ShortcutEventOutput} from './ng-keyboard-shortcuts.interfaces';
import {KeyboardShortcutsService} from './ng-keyboard-shortcuts.service';

@Component({
    selector: "ng-keyboard-shortcut",
    template: "<ng-content ></ng-content>",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyboardShortcutComponent implements AfterViewInit, OnDestroy, OnChanges {
    constructor(private keyboard: KeyboardShortcutsService) {}
    private clearId;

    @Input() description: string;
    // @Input() encapsulate = true;
    @Input() label: string;
    @Input() preventDefault: boolean;
    @Input() allowIn: AllowIn[];
    @Input() key: string | string[];
    @Input() target: HTMLElement;
    @Input() throttleTime: number;

    @Output() fire = new EventEmitter();


    ngOnDestroy(): void {
        this.keyboard.remove(this.clearId);
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    ngAfterViewInit(): void {
        this.clearId = this.keyboard.add({
            description: this.description,
            label: this.label,
            preventDefault: this.preventDefault,
            allowIn: this.allowIn,
            target: this.target,
            key: this.key,
            throttleTime: this.throttleTime,
            command: (event: ShortcutEventOutput) => {
                this.fire.emit(event);
            }
        })
    }

}
