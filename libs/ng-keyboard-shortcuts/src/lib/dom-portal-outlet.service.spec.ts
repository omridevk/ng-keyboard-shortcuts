import { ApplicationRef, Injector, ViewContainerRef } from '@angular/core';
import {TestBed} from '@angular/core/testing';

import {DomPortalOutlet} from './dom-portal-outlet';

describe('DomPortalOutletService', () => {
    const viewContainerRefMock: ViewContainerRef = {} as any;

    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const injector = TestBed.inject(Injector);
        const appRef = TestBed.inject(ApplicationRef);

        const service: DomPortalOutlet = new DomPortalOutlet(
            document.body,
            viewContainerRefMock,
            appRef,
            injector
        );

        expect(service).toBeTruthy();
    });
});
