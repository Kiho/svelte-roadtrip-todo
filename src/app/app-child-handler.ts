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
		} else if (current.pathname === '' || current.pathname === 'app' || current.pathname === 'app/topics') {
			this.isRedirecting = true;
			roadtrip.goto('/app/topics/', { replaceState: true });
		}
		// else if (current.pathname === 'app/topics') {
		// 	roadtrip.goto( '/app/topics/', { invisible: true, replaceState: true });
		// }  
		super.beforeEnter(current, previous);     
	}	
}