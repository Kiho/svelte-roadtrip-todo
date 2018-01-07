import roadtrip from 'roadtrip';
import BaseHandler from './base-handler';
import store from '../store';

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
        current.handler = this;
        this.routeData = current;              
        if (!this.isLoggedIn()) {
            roadtrip.goto('/login');
        }
    }

    protected enter(current, previous) {        
        console.log('Entered!', current);
        store.setCurrentPath('/' + current.pathname);       
        if (this.isRedirecting){
            this.isRedirecting = false;            
            console.log(`current.pathname: [${current.pathname}]`);
            return;
        }
        this.createParent(this); 
        this.getData().then((data) => {
            this.options.data = data;
            if (current.handler !== previous.handler) {
                if (this.create(this.options)){
                    this.activateOnce(this.component);
                }
            } else {
                this.component.set(this.options.data);
            }
        });              
    }

    protected leave(current, next) {
        console.log('Left!', current.pathname, next.pathname); 
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