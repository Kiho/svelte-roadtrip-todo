import roadtrip from 'roadtrip';
const model = require('../modules/model.js');

roadtrip.Routing ={}

export default class GenericHandler {
    public component;

    constructor(private ctor, protected target) {
        this.beforeEnter = this.beforeEnter.bind(this);
        this.enter = this.enter.bind(this);
        this.leave = this.leave.bind(this);
    }

    protected beforeEnter(current, previous) {
        const currentUser = model.getCurrentUser()
        console.warn('beforeEnter', currentUser, current, previous);                
        if (!currentUser || (currentUser && !currentUser.name)) {
            roadtrip.goto('/login')
        }
    }

    protected enter(current, previous) {
        this.component = new this.ctor({
            target: document.querySelector(this.target),
        });   
        console.log('Entered!', current); 
        if (roadtrip.Routing.notify) {
            roadtrip.Routing.notify(current); 
        } else {
            console.warn('Routing.notify was not set');
        }
    }

    protected leave(current, previous) {
        this.component.destroy();
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