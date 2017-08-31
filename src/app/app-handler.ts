import Component from './app.html'
import roadtrip from 'roadtrip';
import GenericHandler from '../generic-handler';

const model = require('../../modules/model.js');

export default class AppHandler extends GenericHandler {
    constructor(path, target) {
		super(path, Component, null);

		this.target= target;

		this.logout = this.logout.bind(this);
		this.activate = this.activate.bind(this);
	}
	
	protected logout() {
		model.saveCurrentUser(null);
		roadtrip.goto('/login');
	}

	protected beforeEnter(current, previous) {
		if (!this.isLoggedIn()) {
			roadtrip.goto('/login');
		} else if (current.pathname === '' || current.pathname === 'app') {
			roadtrip.goto('/app/topics');
		}
	}
	
	protected activate(component) {
		component.on('logout', this.logout);		
	}

	protected enter(current, previous) {
		this.options = { data: { currentUser: model.getCurrentUser() } };
		console.log('Entered App!', current);
		super.enter(current, previous);
	}
}