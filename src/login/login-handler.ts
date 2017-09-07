import Component from './login.html'
import roadtrip from 'roadtrip';
import GenericHandler from '../handlers/generic-handler';

const model = require('../../modules/model.js');

export default class LoginHandler extends GenericHandler {
    component;

    constructor(path, protected targetName) {
        super(path, Component, null);

        this.login = this.login.bind(this);
    }

    login() {
        const username = this.component.get('username');
        if (username) {
            model.saveCurrentUser(username);
            roadtrip.goto('/');
            return true;
        }
        return false;
    }

    public activate(component) {
        this.component.on('login', this.login);
    }
}