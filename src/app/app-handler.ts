import Component from './app.html'
import roadtrip from 'roadtrip';
import GenericHandler from '../generic-handler';

const model = require('../../modules/model.js');

export default class AppHandler extends GenericHandler {
    constructor(target, child?) {
		super(child, target);
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

	protected createApp = () => {
        if (!this.app) {
            this.app = new Component({
                target: document.querySelector("#app-root"),
			}); 
			this.activate(this.app, this);
        }
	}
	
	protected destoryApp  = () => {
        if (this.app) {
			this.app.destroy();
			this.app = null;
        }
	}

	protected enter(current, previous) {
		this.createApp();
		super.enter(current, previous);
		if (this.target === 'uiView') {			
			this.activate(this.component, this);
		}
	}
	
	protected destory() {
        // don't destroy instance
    }
}