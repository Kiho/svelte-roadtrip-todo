import Component from './app.html'
import roadtrip from 'roadtrip';
import AppChildHandler from './app-child-handler';
import events from '../events';

const model = require('../../modules/model.js');

export default class AppHandler extends AppChildHandler {
    constructor(path, target) {
		super(path, Component, null);

		this.targetName = target;
		this.logout = this.logout.bind(this);
	}
	
	protected async getData() {
		return  { currentUser: model.getCurrentUser() };
	}

	protected logout() {
		model.saveCurrentUser(null);
		roadtrip.goto('/login');
	}

	public activate(component) {
		// events.setEvent(component, x => this.setCurrentPath(component, x));
		component.on('logout', this.logout);
	}
}