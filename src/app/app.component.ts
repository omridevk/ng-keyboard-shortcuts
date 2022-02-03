import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { KeyboardShortcutsHelpService, KeyboardShortcutsSelectService } from "ng-keyboard-shortcuts";
@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit {
    mobileQuery: MediaQueryList;

    private _mobileQueryListener: () => void;

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        public help: KeyboardShortcutsHelpService,
        private keyboardSelect: KeyboardShortcutsSelectService
    ) {
        this.mobileQuery = media.matchMedia("(max-width: 600px)");
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.keyboardSelect.select('cmd + g').subscribe(e => console.log("using select to listen to shortcuts", {e}));
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    public showHelp = false;
    ngAfterViewInit(): void {}
}
