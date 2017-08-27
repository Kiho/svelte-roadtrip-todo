import Component from './app.html'
import roadtrip from 'roadtrip';
import GenericHandler from '../generic-handler';

const model = require('../../modules/model.js');

export default class AppHandler extends GenericHandler {
    constructor(target) {
		super(Component, target);
	}
	
	// protected beforeEnter(route) {
    //     // roadtrip.goto('/app/topics');
	// }
	
	activate(component) {
		this.component.on('logout', function() {
			model.saveCurrentUser(null);
			roadtrip.goto('login');
		});
	}

	protected enter(current, previous) {
		super.enter(current, previous);
		this.activate(this.component);
    }
}