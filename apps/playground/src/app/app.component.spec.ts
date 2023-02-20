import { TestBed, waitForAsync } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { KeyboardShortcutsModule } from "ng-keyboard-shortcuts";
import { AppComponent } from "./app.component";
import { MaterialModule } from "./material-module";

describe("AppComponent", () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [
                NoopAnimationsModule,
                MaterialModule,
                KeyboardShortcutsModule.forRoot(),
                RouterTestingModule
            ]
        }).compileComponents();
    }));
    it("should create the app", waitForAsync(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
