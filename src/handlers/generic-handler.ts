import roadtrip from 'roadtrip';
import BaseHandler from './base-handler';
const model = require('../../modules/model.js');

export default abstract class GenericHandler extends BaseHandler {
    constructor(path: string, ctor, public parent: GenericHandler, protected options = { data: null } ) {
        super(path, ctor, parent);
        
        this.beforeEnter = this.beforeEnter.bind(this);
        this.activate = this.activate.bind(this);
        this.enter = this.enter.bind(this);
        this.leave = this.leave.bind(this);
        this.getData = this.getData.bind(this);
    }

    protected async getData(): Promise<{}> {
        return null;
    }

    protected beforeEnter(current, previous) {        
        // console.log('beforeEnter', current, previous);
        current.handler = this;
        this.routeData = current;              
        if (!this.isLoggedIn()) {
            roadtrip.goto('/login');
        }
    }

    protected enter(current, previous) {        
        console.log('Entered!', current);
        if (this.isRedirecting){
            this.isRedirecting = false;            
            console.log(`current.pathname: [${current.pathname}]`);
            return;
        }
        this.createParent(this); 
        this.getData().then((data) => {
            this.options.data = data;
            if (current.handler !== previous.handler) {
                // this.destroyPrevious(current, previous);
                if (this.create(this.options)){
                    this.activateOnce(this.component);
                }
            } else {
                this.component.set(this.options.data);
            }
            roadtrip.routing.events.emit('enter', current);
        });              
    }

    protected leave(current, previous) {
        // current.destroy = this.destroy.bind(this, this.component);
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
        if (self !== this) {
            this.getData().then((data) => {
                    this.options.data = data;                    
                    this.create(this.options);
                    this.activateOnce(this.component);
                }               
            );          
        }       
    }
    
    public activateOnce(component) {
        if (!this.component.get('isActivated')) {
			this.activate(component);
            component.set({isActivated: true});
        }
    }

    public activate(component) {
        // console.warn('activate generic handler');
    }
}