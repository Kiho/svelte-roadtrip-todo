import roadtrip from 'roadtrip';
const model = require('../modules/model.js');

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

    public parent: BaseHandler;

    protected target = 'uiView';

    protected routeData;
    
    protected options;

    constructor(public path, private ctor) {
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
                if (current.pathname.indexOf(previous.pathname) === -1 ) {
                    previous.destroy();
                }
            }
            if (current.handler !== previous.handler && previous.handler) {
                if (current.handler.target == previous.handler.target) {
                    previous.destroy();
                }
                if (previous.handler.parent) {
                    previous.handler.parent.destroyPrevious(current, previous.handler.parent.routeData);
                }                
            }
        }		
    }

    protected isLoggedIn() {
        const currentUser = model.getCurrentUser();             
        return (currentUser && currentUser.name);
    }

    private findMountTo(parent, selector) {
        let mountTo = this.parent ? this.parent.findElement(this.target) : null;            
        return mountTo ?  mountTo : document.querySelector(this.target);
    }

    public create(options) {
        if (!this.component) {            
            options.target = this.findMountTo(this.parent, this.target);
            this.component = construct(this.ctor, options);
            console.log('generic - create', this.component); 
        } 
    }

    protected destroy() {
        if (this.component) {
            console.log('generic - destroy', this.component); 
            this.component.destroy();
            this.component = null;
        }
    }

    public findElement(selector) {
        if (this.options && this.options.target) {
            return <HTMLElement>this.options.target.querySelector(selector)
        }
        return null;        
    }

    protected abstract enter(current, previous);

    protected abstract leave(current, previous);

    protected abstract activate(component, current?)
}