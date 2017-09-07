import roadtrip from 'roadtrip';
import GenericHandler from './generic-handler';

const model = require('../../modules/model.js');

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

    public childComponents;

    public element: HTMLElement;

    protected targetName = 'uiView';

    protected targetId: string;

    protected routeData;
    
    protected options?: IOptions;

    constructor(public path, private ctor, public parent: GenericHandler) {
        this.create = this.create.bind(this);
        this.destroy = this.destroy.bind(this);
        this.findElement = this.findElement.bind(this);
    }

    protected isLoggedIn() {
        const currentUser = model.getCurrentUser();             
        return (currentUser && currentUser.name);
    }

    private findMountTo(parent, selector) {
        let mountTo = parent ? parent.findElement(selector) : null;
        return mountTo ?  mountTo : document.querySelector(selector);
    }

    public create(options) {
        if (!this.component) {                 
            this.targetId = this.getTargetId(this.parent, this).replace('#', '');    
            this.element = this.findMountTo(this.parent, this.targetName);
            if (document.getElementById(this.targetId)) {
                this.destroyTarget(this.targetId);
            }
            options.target = this.element;
            this.component = construct(this.ctor, options);
            this.element.id = this.targetId;                   
            return true;
        }
        return false;
    }

    protected destroyPrevious  = (current, previous) => {        
        if (current && previous && previous.destroy) {                 
            if (current.pathname.indexOf(previous.pathname ? previous.pathname : 'app') === -1 ) {
                previous.destroy();
            } 
        }
    }

    protected getTargetId(parent: BaseHandler, handler: BaseHandler) {
        let id = (parent ? parent.targetId + '_' : '') + handler.targetName;
        console.log('targetId', id, handler.path);
        return id;
    }

    protected destroyTarget(targetId: string) {        
        this.routeHandlers.forEach(h => {
            if (h.targetId && h.targetId.indexOf(targetId) > -1) {
                if (h.component) {
                    console.warn('base - destroyTarget', targetId);
                    h.component.destroy();
                    h.component = null;
                }
            }
        });
    }

    protected destroy(handler: GenericHandler) {
        if (this.component) {
            this.component.destroy();
            this.component = null;
        }
    }

    protected addChildComponent = (component, ctor, target) => {
		const element = this.findElement(target);
        const child = new ctor({target: element});
        // element.id = this.getTargetId(this, this).replace('#', '');
        this.childComponents = this.childComponents || [];
        this.childComponents.push(child);
		component.on('destroy', function() {
            child.destroy();
        });
    }

    public findElement(selector?) {
        if (this.options && this.options.target) {
            let element: Element = this.options.target;
            if (selector) {
                element = this.options.target.querySelector(selector);
            }
            return <HTMLElement>element;
        }
        return null;        
    }

    protected get routeHandlers() : GenericHandler[]{
        return (window as any).Routes.handlers;
    }
}