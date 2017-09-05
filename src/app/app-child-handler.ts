import roadtrip from 'roadtrip';
import GenericHandler from '../handlers/generic-handler';

const model = require('../../modules/model.js');

export default class AppChildHandler extends GenericHandler {
    constructor(path, child, parent, options?) {
        super(path, child, parent, options);
	}
	
	protected beforeEnter(current, previous) {
		if (!this.isLoggedIn()) {
			roadtrip.goto('/login');
		} else if (current.pathname === '' || current.pathname === 'app') {
			roadtrip.goto('/app/topics');
		}        
	}	

	protected enter(current, previous) {	
		super.enter(current, previous);
	}
}