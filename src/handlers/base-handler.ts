import roadtrip from 'roadtrip';
import GenericHandler from './generic-handler';
import store from "../store";

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
    public component: Svelte;

    // public components: Svelte[] = [];

    public element: HTMLElement;

    protected targetName = 'uiView';

    protected targetId: string;

    protected routeData;
    
    protected options?: IOptions;

    protected isRedirecting = false;
    protected isCreated = false;

    constructor(public path, protected ctor, public parent: GenericHandler) {
        this.create = this.create.bind(this);
        this.destroy = this.destroy.bind(this);
        this.findElement = this.findElement.bind(this);
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
        if (!this.parent) {
            this.targetId = this.getTargetId(this.parent, this);
            this.element = this.findMountTo(this.parent, this.targetName);
            this.destroyTarget(this.targetId);
            options.target = this.element;
            options.store = store;
            this.component = construct(this.ctor, options);
            this.isCreated = true;
            return true;
        } else if (!this.isCreated) {
            this.parent.setAsChild(this); 
            this.isCreated = true;                       
            return true;
        } 
        else {
            this.parent.setAsChild(this); 
        }
        return false;
    }

    protected getTargetId(parent: BaseHandler, handler: BaseHandler) {
        let id = (parent ? parent.targetId + '_' : '') + handler.targetName;
        return id.replace('#', '');
    }

    protected destroyTarget(targetId: string) {        
        this.routeHandlers.forEach(h => {
            if (h.targetId && h.targetId.indexOf(targetId) > -1) {
                this.destroy(h);
            }
        });
    }

    protected destroyAll() {        
        this.routeHandlers.forEach(h => {
            this.destroy(h);
        });
    }

    protected destroy(handler: GenericHandler) {
        if (handler.component) {
            // console.log('destory', handler.component);
            if (!handler.parent) {
                handler.component.destroy();
            }            
            handler.component = null;
            handler.isCreated = false;
        }
    }

    public findElement(selector?) {
        if (this.options && this.options.target) {
            let element: Element = this.options.target;
            if (selector) {
                element = this.options.target.querySelector(selector);
            }
            console.log('findElement', selector, element);
            return <HTMLElement>element;
        }
        return null;        
    }

    public findElementInTarget(selector?) {
        if (this.component) {
            let element: HTMLElement = this.component.get().element;
            if (selector) {
                element = element.querySelector(selector);
            }
            console.log('findElementInTarget', selector, element);
            return element;
        }
        return null;        
    }

    protected get routeHandlers() : GenericHandler[] {
        return store.get().routes.handlers;
    }  
}