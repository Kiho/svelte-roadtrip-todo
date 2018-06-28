import Login from './login.html'
import roadtrip from 'roadtrip';
import GenericHandler from '../handlers/generic-handler';

const model = require('../../modules/model.js');

export default class LoginHandler extends GenericHandler {
    component;

    constructor(path, protected targetName) {
        super(path, Login, null);

        this.login = this.login.bind(this);
    }

    login() {
        const { username } = this.component.get();
        if (username) {
            model.saveCurrentUser(username);
            roadtrip.goto('/');
            return true;
        }
        return false;
    }

    public activate(component: Login) {
        this.component.on('login', this.login);
    }
}