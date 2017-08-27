import roadtrip from 'roadtrip';
const model = require('../modules/model.js');

roadtrip.Routing ={}

export default class GenericHandler {
    public app;
    
    public component;

    target = 'uiView';

    constructor(private ctor, public parent) {
        this.beforeEnter = this.beforeEnter.bind(this);
        this.enter = this.enter.bind(this);
        this.leave = this.leave.bind(this);
        this.create = this.create.bind(this);
        this.destory = this.destory.bind(this);
    }

    protected isLoggedIn() {
        const currentUser = model.getCurrentUser()                
        return (currentUser && currentUser.name);
    }

    protected beforeEnter(current, previous) {
        console.warn('beforeEnter', current, previous);                
        if (!this.isLoggedIn()) {
            roadtrip.goto('/login')
        }
    }

    protected create() {
        if (!this.component) {
            this.component = new this.ctor({
                target: document.querySelector(this.target),
            }); 
        }
    }

    protected destory() {
        if (this.component) {
            this.component.destroy();
            this.component = null;
        }
    }

    protected enter(current, previous) {
        if (previous.destory) {
            previous.destory();
            previous.destory = null;
        }
        this.create();
        console.log('Entered!', current); 
        if (roadtrip.Routing.notify) {
            roadtrip.Routing.notify(current); 
        } else {
            console.warn('Routing.notify was not set');
        }
    }

    protected leave(current, previous) {
        current.destory = this.destory;
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