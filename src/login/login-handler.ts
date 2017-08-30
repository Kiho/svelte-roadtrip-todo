import Component from './login.html'
import roadtrip from 'roadtrip';
import BaseHandler from '../base-handler';

const model = require('../../modules/model.js');

export default class LoginHandler extends BaseHandler {
    component;

    constructor(path, protected target) {
        super(path, Component);

        this.login = this.login.bind(this);
		this.activate = this.activate.bind(this);
        this.enter = this.enter.bind(this);
        this.leave = this.leave.bind(this);
    }

    login() {
        const username = this.component.get('username');
        if (username) {
            model.saveCurrentUser(username);
            roadtrip.goto('/');
            return true;
        }
        return false;
    }

    protected activate(component) {
        this.component.on('login', this.login);
    }

    protected enter(current, previous) {
        current.handler = this;
        this.routeData = current;
        this.destroyPrevious(current, previous);
        this.create({});
        console.log('Entered!', current); 
        if (roadtrip.Routing.notify) {
            roadtrip.Routing.notify(current); 
        } else {
            console.warn('Routing.notify was not set');
        }
        this.activate(this.component);
    }

    protected leave(current, previous) {
        current.destroy = this.destroy;
        console.log('Left!', current);  
    }

    get route() {
        return {
            // beforeenter: this.beforeEnter,
            enter: this.enter,
            leave: this.leave,
        }
    }
}