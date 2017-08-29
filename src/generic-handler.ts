import roadtrip from 'roadtrip';
const model = require('../modules/model.js');

roadtrip.Routing = {}

function construct(component, options) {
    return options.methods
        ? instantiateWithMethods(component, options, options.methods)
        : new component(options)
}

function instantiateWithMethods(component, options, methods) {
	return Object.assign(new component(options), methods)
}

export default class GenericHandler {
    public app;
    
    public component;

    protected target = 'uiView';

    constructor(private ctor, public parent, protected options = {}) {
        this.beforeEnter = this.beforeEnter.bind(this);
        this.enter = this.enter.bind(this);
        this.leave = this.leave.bind(this);
        this.create = this.create.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    private destroyPrevious  = (current, previous) => {
        if (current && previous && previous.destroy) {
            if(current.pathname.indexOf(previous.pathname) === -1) {
                previous.destroy();
            }
        }
    }

    protected isLoggedIn() {
        const currentUser = model.getCurrentUser();             
        return (currentUser && currentUser.name);
    }

    protected beforeEnter(current, previous) {
        console.warn('beforeEnter', current, previous);                
        if (!this.isLoggedIn()) {
            roadtrip.goto('/login');
        }
    }

    protected create(options) {
        if (!this.component) {
            options.target = document.querySelector(this.target);
            this.component = construct(this.ctor, options);
        } else {
            this.component.set(options);
        }
    }

    protected destroy() {
        if (this.component) {
            this.component.destroy();
            this.component = null;
        }
    }

    protected enter(current, previous) {
        this.destroyPrevious(current, previous);
        this.create(this.options);
        console.log('Entered!', current); 
        if (roadtrip.Routing.notify) {
            roadtrip.Routing.notify(current); 
        } else {
            console.warn('Routing.notify was not set');
        }
    }

    protected leave(current, previous) {
        current.destroy = this.destroy;
        console.log('Left!', current);  
    }

    get route() {
        return {
            beforeenter: this.beforeEnter,
            enter: this.enter,
            leave: this.leave,
        }
    }
}