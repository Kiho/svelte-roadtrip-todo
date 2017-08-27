import Component from './app.html'
import roadtrip from 'roadtrip';
import GenericHandler from '../generic-handler';

const model = require('../../modules/model.js');

export default class AppHandler {
	app;

    constructor(private target) {
        this.beforeEnter = this.beforeEnter.bind(this);
        this.enter = this.enter.bind(this);
        this.leave = this.leave.bind(this);
        // this.create = this.create.bind(this);
        // this.destory = this.destory.bind(this);
	}
	
	protected isLoggedIn() {
        const currentUser = model.getCurrentUser()                
        return (currentUser && currentUser.name);
	}
	
	protected beforeEnter(current, previous) {
		if (!this.isLoggedIn()) {
			roadtrip.goto('/login');
		} else if (current.pathname === '' ||current.pathname === 'app') {
			roadtrip.goto('/app/topics');
		}        
	}
	
	activate(component, self) {
		component.on('logout', function() {
			model.saveCurrentUser(null);
			self.app.teardown();
			self.app = null;
			roadtrip.goto('/login');
		});
	}

	public createApp = () => {
        if (!this.app) {
            this.app = new Component({
                target: document.querySelector("#app-root"),
			}); 
			this.activate(this.app, this);
        }
	}
	
	public destoryApp  = () => {
        if (this.app) {
			this.app.destroy();
			this.app = null;
        }
	}

	protected enter(current, previous) {
		this.createApp();
		console.log('Entered App!', current);
	}

	protected leave(current, previous) {
        this.destoryApp();
        console.log('Left App!', current);  
    }

    get route() {
        return {
            beforeenter: this.beforeEnter,
            enter: this.enter,
            leave: this.leave,
        }
    }
}