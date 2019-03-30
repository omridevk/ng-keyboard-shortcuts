import {
    TemplateRef,
    ViewContainerRef,
    ElementRef,
    ComponentRef,
    EmbeddedViewRef,
    Injector,
    ComponentFactoryResolver,
} from '@angular/core';

/** Interface that can be used to generically type a class. */
export interface ComponentType<T> {
    new (...args: any[]): T;
}

/**
 * A `Portal` is something that you want to render somewhere else.
 * It can be attach to / detached from a `PortalOutlet`.
 */
export abstract class Portal<T> {
    private _attachedHost: PortalOutlet | null;

    /** Attach this portal to a host. */
    attach(host: PortalOutlet): T {
        if (host == null) {
            // TODO: add error
            console.error("null portal error");
        }

        if (host.hasAttached()) {
            console.error("portal already attached");
            // throwPortalAlreadyAttachedError();
        }

        this._attachedHost = host;
        return <T> host.attach(this);
    }

    /** Detach this portal from its host */
    detach(): void {
        let host = this._attachedHost;

        if (host == null) {
            console.error("no portal attached!");
            // throwNoPortalAttachedError();
        } else {
            this._attachedHost = null;
            host.detach();
        }
    }

    /** Whether this portal is attached to a host. */
    get isAttached(): boolean {
        return this._attachedHost != null;
    }

    /**
     * Sets the PortalOutlet reference without performing `attach()`. This is used directly by
     * the PortalOutlet when it is performing an `attach()` or `detach()`.
     */
    setAttachedHost(host: PortalOutlet | null) {
        this._attachedHost = host;
    }
}


/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
export class ComponentPortal<T> extends Portal<ComponentRef<T>> {
    /** The type of the component that will be instantiated for attachment. */
    component: ComponentType<T>;

    /**
     * [Optional] Where the attached component should live in Angular's *logical* component tree.
     * This is different from where the component *renders*, which is determined by the PortalOutlet.
     * The origin is necessary when the host is outside of the Angular application context.
     */
    viewContainerRef?: ViewContainerRef | null;

    /** [Optional] Injector used for the instantiation of the component. */
    injector?: Injector | null;

    /**
     * Alternate `ComponentFactoryResolver` to use when resolving the associated component.
     * Defaults to using the resolver from the outlet that the portal is attached to.
     */
    componentFactoryResolver?: ComponentFactoryResolver | null;

    constructor(
        component: ComponentType<T>,
        viewContainerRef?: ViewContainerRef | null,
        injector?: Injector | null,
        componentFactoryResolver?: ComponentFactoryResolver | null) {
        super();
        this.component = component;
        this.viewContainerRef = viewContainerRef;
        this.injector = injector;
        this.componentFactoryResolver = componentFactoryResolver;
    }
}

/**
 * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
 */
export class TemplatePortal<C = any> extends Portal<C> {
    /** The embedded template that will be used to instantiate an embedded View in the host. */
    templateRef: TemplateRef<C>;

    /** Reference to the ViewContainer into which the template will be stamped out. */
    viewContainerRef: ViewContainerRef;

    /** Contextual data to be passed in to the embedded view. */
    context: C | undefined;

    constructor(template: TemplateRef<C>, viewContainerRef: ViewContainerRef, context?: C) {
        super();
        this.templateRef = template;
        this.viewContainerRef = viewContainerRef;
        this.context = context;
    }

    get origin(): ElementRef {
        return this.templateRef.elementRef;
    }

    /**
     * Attach the portal to the provided `PortalOutlet`.
     * When a context is provided it will override the `context` property of the `TemplatePortal`
     * instance.
     */
    attach(host: PortalOutlet, context: C | undefined = this.context): C {
        this.context = context;
        return super.attach(host);
    }

    detach(): void {
        this.context = undefined;
        return super.detach();
    }
}


/** A `PortalOutlet` is an space that can contain a single `Portal`. */
export interface PortalOutlet {
    /** Attaches a portal to this outlet. */
    attach(portal: Portal<any>): any;

    /** Detaches the currently attached portal from this outlet. */
    detach(): any;

    /** Performs cleanup before the outlet is destroyed. */
    dispose(): void;

    /** Whether there is currently a portal attached to this outlet. */
    hasAttached(): boolean;
}


/**
 * Partial implementation of PortalOutlet that handles attaching
 * ComponentPortal and TemplatePortal.
 */
export abstract class BasePortalOutlet implements PortalOutlet {
    /** The portal currently attached to the host. */
    protected _attachedPortal: Portal<any> | null;

    /** A function that will permanently dispose this host. */
    private _disposeFn: (() => void) | null;

    /** Whether this host has already been permanently disposed. */
    private _isDisposed: boolean = false;

    /** Whether this host has an attached portal. */
    hasAttached(): boolean {
        return !!this._attachedPortal;
    }

    attach<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    attach<T>(portal: TemplatePortal<T>): EmbeddedViewRef<T>;
    attach(portal: any): any;

    /** Attaches a portal. */
    attach(portal: Portal<any>): any {
        if (!portal) {
            console.error('null portal!');
            // throwNullPortalError();
        }

        if (this.hasAttached()) {
            console.error('portal already attached');
            // throwPortalAlreadyAttachedError();
        }

        if (this._isDisposed) {
            console.error('portal out already disposed');
            // throwPortalOutletAlreadyDisposedError();
        }

        if (portal instanceof ComponentPortal) {
            this._attachedPortal = portal;
            return this.attachComponentPortal(portal);
        } else if (portal instanceof TemplatePortal) {
            this._attachedPortal = portal;
            return this.attachTemplatePortal(portal);
        }
        console.error('unknown portal type');
        // throwUnknownPortalTypeError();
    }

    abstract attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;

    abstract attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C>;

    /** Detaches a previously attached portal. */
    detach(): void {
        if (this._attachedPortal) {
            this._attachedPortal.setAttachedHost(null);
            this._attachedPortal = null;
        }

        this._invokeDisposeFn();
    }

    /** Permanently dispose of this portal host. */
    dispose(): void {
        if (this.hasAttached()) {
            this.detach();
        }

        this._invokeDisposeFn();
        this._isDisposed = true;
    }

    /** @docs-private */
    setDisposeFn(fn: () => void) {
        this._disposeFn = fn;
    }

    private _invokeDisposeFn() {
        if (this._disposeFn) {
            this._disposeFn();
            this._disposeFn = null;
        }
    }
}
