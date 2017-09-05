import roadtrip from 'roadtrip';
import GenericHandler from './generic-handler';

const model = require('../../modules/model.js');

function construct(component, options) {
    return options.methods
        ? instantiateWithMethods(component, options, options.methods)
        : new component(options);
}

function instantiateWithMethods(component, options, methods) {
	return Object.assign(new component(options), methods);
}

export default abstract class BaseHandler {
    public app;
    
    public component;

    public element: HTMLElement;

    protected target = 'uiView';

    protected routeData;
    
    protected options?: IOptions;

    protected reset: (newData) => void;

    constructor(public path, private ctor, public parent: GenericHandler) {
        this.create = this.create.bind(this);
        this.destroy = this.destroy.bind(this);
        this.findElement = this.findElement.bind(this);

        this.activate = this.activate.bind(this);
        this.enter = this.enter.bind(this);
        this.leave = this.leave.bind(this);
    }

    protected isSameHandler = (current, previous) => {
        return  current && previous && (current.handler === previous.handler && previous.handler);
    }

    protected destroyPrevious  = (current, previous) => {        
        if (current && previous) {                 
            if (previous.destroy) {
                if (current.pathname.indexOf(previous.pathname ? previous.pathname : 'app') === -1 ) {
                    previous.destroy();
                } else if (current.handler.findElement() == previous.handler.findElement()) {
                    previous.destroy();
                }
            }
            if (current.handler !== previous.handler && previous.handler) {
                if (current.handler.path === previous.handler.path) {
                    previous.destroy();
                }
                if (previous.handler.parent) {
                    if (previous.handler.parent.routeData) {
                        previous.handler.parent.destroyPrevious(current, previous.handler.parent.routeData);
                    }
                    if (current.handler && previous.handler && previous.handler.parent) {
                        // this happens before creating component for current handler
                        const owner = current.handler.element ? current.handler.element : document;
                        const el = owner.querySelector(current.handler.target);
                        if (el === previous.handler.parent.element) {
                            console.warn('Destroy same element');
                            previous.handler.parent.destroy();
                        }   
                    }
                }                          
            }                 
        }		
    }

    protected isLoggedIn() {
        const currentUser = model.getCurrentUser();             
        return (currentUser && currentUser.name);
    }

    private findMountTo(parent, selector) {
        let mountTo = parent ? parent.findElement(selector) : null;            
        return mountTo ?  mountTo : document.querySelector(selector);
    }

    public create(options) {
        if (!this.component) {            
            this.element = this.findMountTo(this.parent, this.target);
            options.target = this.element;
            const oldComponent = (this.element as any).component;
            if (oldComponent) {
                oldComponent.destroy();
            }
            this.component = construct(this.ctor, options);
            (this.element as any).component = this.component;
            console.log('generic - create', this.component);            
            return { component: this.component, result: true }
        }
        return  { component: this.component, result: false }
    }

    protected destroy() {
        if (this.component) {
            console.log('generic - destroy', this.component); 
            this.component.destroy();
            this.component = null;
        }
    }

    protected addChildComponent = (component, ctor, elementId) => {
		const element = this.findElement(elementId);
		const child = new ctor({target: element});
		(element as any).component = child;
		component.on('destroy', function() {
            child.destroy();
        });
    }

    public findElement(selector?) {
        if (this.options && this.options.target) {
            let element: Element = this.options.target;
            if (selector) {
                element = this.options.target.querySelector(selector);
            }
            return <HTMLElement>element;
        }
        return null;        
    }

    protected abstract enter(current, previous);

    protected abstract leave(current, previous);

    protected abstract activate(component);
}