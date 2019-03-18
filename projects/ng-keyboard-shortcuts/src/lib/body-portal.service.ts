import {
    ApplicationRef,
    ComponentFactoryResolver,
    Injectable,
    Injector,
    OnDestroy,
    TemplateRef,
    ViewContainerRef
} from "@angular/core";
import { TemplatePortal } from "@angular/cdk/portal";
import { DomPortalHost } from "@angular/cdk/portal";

@Injectable()
export class BodyPortal implements OnDestroy {
    private bodyPortalHost: DomPortalHost;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) {
        this.bodyPortalHost = new DomPortalHost(
            document.body,
            this.componentFactoryResolver,
            this.appRef,
            this.injector
        );
    }

    reveal(template: TemplateRef<any>, viewContainer: ViewContainerRef) {
        this.hide();

        const portal = new TemplatePortal(template, viewContainer);
        this.bodyPortalHost.attach(portal);
    }

    visible() {
        return this.bodyPortalHost.hasAttached();
    }

    hide() {
        if (!this.bodyPortalHost.hasAttached()) {
            return;
        }
        this.bodyPortalHost.detach();
    }
    ngOnDestroy(): void {
        this.hide();
    }
}
