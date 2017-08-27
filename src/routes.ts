import roadtrip from 'roadtrip';
import GenericHandler from './generic-handler';
import LoginHandler from './login/login-handler';
import AppHandler from './app/app-handler';
import TopicsHandler from './app/topics/topics-handler';

import Login from './login/login.html';
import App from './app/app.html';
import About from './app/about/about.html';
import Topics from './app/topics/topics.html';

export default class Routes {
    router;

    loginHandler;
    appHandler;
    aboutHandler;
    topicsHandler;

    constructor(target: string) {
        this.router = roadtrip;
        this.init(target);
    }

    init(target) {
        this.loginHandler = new LoginHandler(target);
        this.appHandler = new AppHandler(target);
        this.aboutHandler = new AppHandler('uiView', About);
        this.topicsHandler = new TopicsHandler('uiView');

        this.router
            .add('/', this.appHandler.route)
            .add('/login', this.loginHandler.route)
            .add('/app/about', this.aboutHandler.route)
            .add('/app/topics', this.topicsHandler.route)
            //   .add('/fetchdata/:id', this.fetchdataDetailsHandler.route)
            .start({
                fallback: '/'
            });
    }
}