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

    protected target = 'uiView';

    protected routeData;
    
    constructor(public path, private ctor) {
        this.create = this.create.bind(this);
        this.destroy = this.destroy.bind(this);
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

    protected create(options) {
        if (!this.component) {
            options.target = document.querySelector(this.target);
            this.component = construct(this.ctor, options);
            console.warn('generic - create', this.component); 
        } 
    }

    protected destroy() {
        if (this.component) {
            console.warn('generic - destroy', this.component); 
            this.component.destroy();
            this.component = null;
        }
    }
}