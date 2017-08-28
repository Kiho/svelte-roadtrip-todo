import roadtrip from 'roadtrip';
import GenericHandler from './generic-handler';
import LoginHandler from './login/login-handler';
import AppHandler from './app/app-handler';
import AppChildHandler from './app/app-child-handler';
import TopicsHandler from './app/topics/topics-handler';
import TasksHandler from './app/topics/tasks/tasks-handler';

import Login from './login/login.html';
import App from './app/app.html';
import About from './app/about/about.html';
import Topics from './app/topics/topics.html';
import Tasks from './app/topics/tasks/tasks.html';

const UUID_V4_REGEX = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}'

export default class Routes {
    router;

    loginHandler;
    appHandler;
    aboutHandler;
    topicsHandler;
    tasksHandler;

    constructor(target: string) {
        this.router = roadtrip;
        this.init(target);
    }

    init(target) {
        this.loginHandler = new LoginHandler(target);
        this.appHandler = new AppHandler(target);
        this.aboutHandler = new AppChildHandler(About, this.appHandler);
        this.topicsHandler = new TopicsHandler(this.appHandler);
        this.tasksHandler = new TasksHandler(this.topicsHandler);

        this.router
            .add('/', this.appHandler.route)
            .add('/login', this.loginHandler.route)
            .add('/app/about', this.aboutHandler.route)
            .add('/app/topics', this.topicsHandler.route)
            .add('/app/topics/:topicId', this.tasksHandler.route)
            .start({
                fallback: '/'
            });
    }
}