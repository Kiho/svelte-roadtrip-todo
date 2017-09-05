import roadtrip from 'roadtrip';
import BaseHandler from './base-handler';
const model = require('../../modules/model.js');

export default abstract class GenericHandler extends BaseHandler {
    constructor(path: string, ctor, public parent: GenericHandler, protected options = {}) {
        super(path, ctor, parent);
        
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
        console.log('Entered!', current);
        this.createParent(this);
        this.create(this.options);
        this.activateOnce(this.component);    
        roadtrip.routing.events.emit('enter', current);     
    }

    protected leave(current, previous) {
		if (current.destroyOnLeave) {
			current.destroyOnLeave.destroy();
			current.destroyOnLeave = null;
		}
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

    protected createParent(self) {
		if (this.parent && !this.parent.component) {
			this.parent.createParent(self);
        }
        if (!this.component) {
            if (self !== this) {
                const that = this;
                const destroy = self.destroy;
                self.destroy = function() {
                    destroy();
                    that.destroy();
                }
            }
            this.create(this.options);
            this.activateOnce(this.component);            
        }       
    }
    
    public activateOnce(component, current?) {
        if (!this.component.get('isActivated')) {
			this.activate(component, current);
            component.set({isActivated: true});
        }
    }

    public activate(component, current?) {
        console.warn('activate generic handler');
    }
}