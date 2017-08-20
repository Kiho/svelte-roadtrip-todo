import Component from './login.html'
const model = require('../../modules/model.js');

export default function(stateRouter) {
	stateRouter.addState({
		name: 'login',
		route: '/login',
		template: Component,
		activate: function({ domApi: svelte }) {
			svelte.on('login', function() {
				const username = svelte.get('username');
				if (username) {
					model.saveCurrentUser(username);
					stateRouter.go('app');
				}
				return false;
			})
		}
	})
}
