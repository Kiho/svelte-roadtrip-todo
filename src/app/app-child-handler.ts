// import Component from './app.html'
import roadtrip from 'roadtrip';
import GenericHandler from '../generic-handler';

const model = require('../../modules/model.js');

export default class AppChildHandler extends GenericHandler {
    createApp;
    
    constructor(child, parent) {
        super(child, parent);
        this.createApp = this.create;
	}
	
	protected beforeEnter(current, previous) {
		if (!this.isLoggedIn()) {
			roadtrip.goto('/login');
		} else if (current.pathname === '' ||current.pathname === 'app') {
			roadtrip.goto('/app/topics');
		}        
	}
	
	// activate(component, self) {
	// 	component.on('logout', function() {
	// 		model.saveCurrentUser(null);
	// 		self.app.teardown();
	// 		self.app = null;
	// 		roadtrip.goto('/login');
	// 	});
	// }

	protected enter(current, previous) {
		this.parent.createApp();
		super.enter(current, previous);
		// if (this.target === 'uiView') {			
		// 	this.activate(this.component, this);
		// }
	}
}