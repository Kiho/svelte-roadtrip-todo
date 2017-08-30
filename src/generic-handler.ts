import roadtrip from 'roadtrip';
import BaseHandler from './base-handler';
const model = require('../modules/model.js');

roadtrip.Routing = {}

export default abstract class GenericHandler extends BaseHandler {
    constructor(path: string, ctor, public parent, protected options = {}) {
        super(path, ctor);
        
        this.beforeEnter = this.beforeEnter.bind(this);
        this.enter = this.enter.bind(this);
        this.leave = this.leave.bind(this);
    }

    protected beforeEnter(current, previous) {
        console.warn('beforeEnter', current, previous);                
        if (!this.isLoggedIn()) {
            roadtrip.goto('/login');
        }
    }

    protected enter(current, previous) {
        current.handler = this;
        this.routeData = current;
        this.destroyPrevious(current, previous);
        this.create(this.options);
        console.log('Entered!', current); 
        if (roadtrip.Routing.notify) {
            roadtrip.Routing.notify(current); 
        } else {
            console.warn('Routing.notify was not set');
        }
        this.activate(this.component, previous);
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

    protected activate(component, current) {
        console.warn('activate generic handler');
    }
}