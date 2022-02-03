import { TestBed } from "@angular/core/testing";

import { DomPortalOutletService } from "./dom-portal-outlet";

describe("DomPortalOutletService", () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it("should be created", () => {
        const service: DomPortalOutletService = TestBed.get(DomPortalOutletService);
        expect(service).toBeTruthy();
    });
});
