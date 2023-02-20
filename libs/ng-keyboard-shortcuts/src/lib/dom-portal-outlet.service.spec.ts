import { ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import {TestBed} from '@angular/core/testing';

import {DomPortalOutlet} from './dom-portal-outlet';

describe('DomPortalOutletService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const componentFactoryResolver = TestBed.inject(ComponentFactoryResolver);
        const injector = TestBed.inject(Injector);
        const appRef = TestBed.inject(ApplicationRef);

        const service: DomPortalOutlet = new DomPortalOutlet(
            document.body,
            componentFactoryResolver,
            appRef,
            injector
        );

        expect(service).toBeTruthy();
    });
});
