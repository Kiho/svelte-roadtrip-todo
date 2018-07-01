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
        this.routeData = current;
        if (previous && previous.pathname)   {
            this.destoryPrevious(current, previous);
        }           
        if (!this.isLoggedIn()) {
            roadtrip.goto('/login');
        }
    }

    protected destoryPrevious(current, previous) {
        const c = current.pathname.split('/');
        const p = previous.pathname.split('/');
        const position = c.length - 1;
        if (p.length >= c.length && c[position] != p[position]) {
            if (c.length == 2 && current.handler.parent) {
                this.destroyAll();
            }
            if (c.length == 1 && !current.handler.parent && previous.handler.component) {
                this.destroyAll();
            }
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
            store.set({ routeData: data });
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
                    store.set({ routeData: data });                  
                    this.create(this.options);
                    this.activateOnce(this.component);
                }               
            );          
        }       
    }
    
    public setAsChild(handler) {
        console.log('setAsChild!', this);
        if (this.component) {
            store.set({ routeHandler: handler });
            this.component.set({ uiView: handler.ctor });
        }
    }

    public activateOnce(component) {
        console.log('activateOnce!', component, this);
        if (!this.component) {
            this.parent.setAsChild(this);
            this.component = this.ctor.component;
            if (this.component){                
                this.activate(this.component);
                this.component.set({isActivated: true});
            } else {
                console.warn('No oncreate handler', this);
            }
            return;
        }
        if (!this.component.get().isActivated) {
			this.activate(component);
            component.set({isActivated: true});
        }
    }

    public activate(component) {
        // console.warn('activate generic handler');
    }
}