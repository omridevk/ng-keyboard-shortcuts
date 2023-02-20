import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { KeyboardShortcutsModule } from "ng-keyboard-shortcuts";

import { HomeComponent } from "./home.component";
import { MaterialModule } from "../material-module";
import { NestedComponent } from "../nested/nested.component";

describe("HomeComponent", () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent,
                NestedComponent
            ],
            imports: [
                NoopAnimationsModule,
                MaterialModule,
                KeyboardShortcutsModule.forRoot(),
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
