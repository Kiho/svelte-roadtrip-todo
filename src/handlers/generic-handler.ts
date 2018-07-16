import roadtrip from 'roadtrip';
import BaseHandler from './base-handler';
import store from '../store';

export default abstract class GenericHandler extends BaseHandler {
    constructor(path: string, ctor, public parent: GenericHandler, protected options = { data: null, store } ) {
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
        this.routeHandler = current;
        if (previous.handler && previous.handler.parent !== this.parent) {
            this.destroyChildren(this.parent);
        }          
        if (!this.isLoggedIn()) {
            roadtrip.goto('/login');
        }
    }

    protected destroyChildren(handler) {
        if (handler) {
            // console.log('destroyChildren - ', `[handler, ${handler.path}]`);       
            handler.children.forEach(h => {
                this.destroy(h);
                this.destroyChildren(h);
            });
        }        
    }

    protected enter(current, previous) {        
        console.log('Entered!', current);
        store.setCurrentPath('/' + current.pathname);       
        if (this.isRedirecting){
            this.isRedirecting = false;            
            // console.log(`isRedirecting - current.pathname: [${current.pathname}]`);
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
                this.component.set(data);
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
        console.log('createParent!', self.path, this);
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
    
    public setAsChild(handler) {
        if (this.component.get().uiView !== handler.ctor) {
            console.log('setAsChild!', this);
            this.component.set({ uiView: handler.ctor });
        }        
    }

    public activateOnce(component) {
        // console.log('activateOnce!', component, this);
        if (!this.component) {
            this.parent.setAsChild(this);
            this.component = this.parent.component.refs.uiView;
            if (this.component) {
                this.component.set(this.options.data);
                // console.log('activateOnce!: this.component.refs', this.component);               
                this.activate(this.component);
                this.component.set({ isActivated: true });
            } else {
                // console.warn('No oncreate handler', this);
            }
            return;
        }
        if (!this.component.get().isActivated) {
			this.activate(component);
            component.set({ isActivated: true });
        }
    }

    public activate(component) {
        // console.warn('activate generic handler');
    }
}