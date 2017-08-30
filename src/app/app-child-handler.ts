// import Component from './app.html'
import roadtrip from 'roadtrip';
import GenericHandler from '../generic-handler';

const model = require('../../modules/model.js');

export default class AppChildHandler extends GenericHandler {
    // createApp;

    constructor(path, child, parent, options?) {
        super(path, child, parent, options);
        // this.createApp = this.create;
	}
	
	protected beforeEnter(current, previous) {
		if (!this.isLoggedIn()) {
			roadtrip.goto('/login');
		} else if (current.pathname === '' ||current.pathname === 'app') {
			roadtrip.goto('/app/topics');
		}        
	}	
    
	protected enter(current, previous) {
		this.parent.create(this.options);
		super.enter(current, previous);
	}
}