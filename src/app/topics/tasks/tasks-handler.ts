import Component from './tasks.html'
import NoTaskSelected from './no-task-selected.html'

import AppChildHandler from '../../app-child-handler';

const model = require('../../../../modules/model.js')
const all = require('async-all')
import roadtrip from 'roadtrip';

// const UUID_V4_REGEX = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}'

const allWithAsync = (...listOfPromises) => {
    return new Promise(async (resolve, reject) => {
        let results = []
        for (let promise of listOfPromises.map(Promise.resolve, Promise)) {
            results.push(await promise.then(async resolvedData => await resolvedData, reject))
            if (results.length === listOfPromises.length) resolve(results)
        }
    })
};

export default class TasksHandler extends AppChildHandler {

    constructor(path, parent) {
        const options = {
            methods: {
                setTaskDone: function(index, done) {
                    const topicId = this.get('topicId')
                    const tasks = this.get('tasks').slice()
                    tasks[index].done = done

                    this.set({ tasks })

                    model.saveTasks(topicId, tasks)
                }
            }
        }
        super(path, Component, parent, options);
	}

    protected beforeEnter(current, previous) {
        super.beforeEnter(current, previous);                
        if (this.isLoggedIn()) {
            const topicId = current.params.topicId;
            const topic = model.getTopicAsync.bind(null, topicId);
            const tasks = model.getTasksAsync.bind(null, topicId);
            roadtrip.data = allWithAsync(topic(), tasks(), topicId);
        }
    }

 	public activate(component, current) {
        if (component.get('isActivated')) {
			return;
		}
        // this.isActivated = true;
        
        component.on('newTaskKeyup', function(e) {
            const topicId = component.get('topicId')
            const newTaskName = component.get('newTaskName')
            if (e.keyCode === 13 && newTaskName) {
                createNewTask(topicId, newTaskName)
                component.set({
                    newTaskName: ''
                })
            }
        });

        component.on('remove', function(taskIndex) {
            const topicId = component.get('topicId')
            let tasksWithIndexElementRemoved = component.get('tasks').slice()

            tasksWithIndexElementRemoved.splice(taskIndex, 1)
            console.log('tasksWithIndexElementRemoved', topicId, tasksWithIndexElementRemoved)

            component.set({
                tasks: tasksWithIndexElementRemoved
            })

            model.saveTasks(topicId, tasksWithIndexElementRemoved)
        });

        function createNewTask(topicId, taskName) {
            const task = model.saveTask(topicId, taskName)
            const newTasks = component.get('tasks').concat(task)
            component.set({
                tasks: newTasks
            });
        }

        const el = this.findElement('.add-new-task');
        if (el) { 
            el.focus() 
        }
        component.set({isActivated: true});
    }
    
	protected enter(current, previous) {
        const self = this;
        if (roadtrip.data.then) {
            return roadtrip.data.then(data => {
                console.log('resolvedData', data);
                this.createParent();        
                super.enter(current, previous);
                this.component.set({ topic: data[0], tasks: data[1], topicId: data[2] });
                if (!this.isSameHandler(current, previous)) {
                    this.activate(this.component, current);
                }
            }, rejectionReason => console.log('reason:', rejectionReason)) // reason: rejected!
        }
    }
}