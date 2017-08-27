import Component from './login.html'
import roadtrip from 'roadtrip';

const model = require('../../modules/model.js');

export default class LoginHandler {
    component;

    constructor(private target) {
        
    }

    get route() {
        return {
            enter: (current, previous) => { 
                this.component = new Component({
                    target: document.querySelector(this.target),
                });   
				console.log('Entered!', current);
				this.component.on('login', () => {
					const username = this.component.get('username');
					if (username) {
						model.saveCurrentUser(username);
                        roadtrip.goto('/');
                        return true;
					}
					return false;
				});
            },
            leave: (current, previous) => {
                this.component.destroy();
                console.log('Left!', current);                
            }
        }
    }
}