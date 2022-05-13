import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NestedComponent } from "./nested.component";

describe("NestedComponent", () => {
    let component: NestedComponent;
    let fixture: ComponentFixture<NestedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NestedComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NestedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
