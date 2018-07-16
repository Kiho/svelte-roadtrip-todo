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
    public children: BaseHandler[] = [];

    public element: HTMLElement;
    protected targetId: string;
    protected routeHandler;
    protected options?: IOptions;
    protected isRedirecting = false;
    protected isCreated = false;

    constructor(public path, protected ctor, public parent: GenericHandler) {
        this.create = this.create.bind(this);
        this.destroy = this.destroy.bind(this);
        if (parent) {
            parent.children.push(this);
        }        
    }

    protected isLoggedIn() {
        const currentUser = model.getCurrentUser();      
        return (currentUser && currentUser.name);
    }

    public create(options) {
        if (!this.parent) {
            this.element = document.querySelector(`#${this.targetId}`);
            this.destroyAll();
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

    protected destroyAll() {        
        this.routeHandlers.forEach(h => {
            this.destroy(h);
        });
    }

    protected destroy(handler: BaseHandler) {
        if (handler.component) {
            // console.log('destory', handler.component);
            if (!handler.parent) {
                handler.component.destroy();
            }            
            handler.component = null;
            handler.isCreated = false;
        }
    }

    public findElementInTarget(selector?) {
        if (this.component) {
            let element: HTMLElement = this.component.refs.container;
            if (selector && element) {
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