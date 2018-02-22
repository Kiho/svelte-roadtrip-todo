import App from './app.html'
import roadtrip from 'roadtrip';
import AppChildHandler from './app-child-handler';

const model = require('../../modules/model.js');

export default class AppHandler extends AppChildHandler {
    constructor(path, target) {
		super(path, App, null);

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

	public activate(component: App) {
		component.on('logout', this.logout);
	}
}