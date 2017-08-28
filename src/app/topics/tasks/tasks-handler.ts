import Component from './tasks.html'
import NoTaskSelected from './no-task-selected.html'

import AppChildHandler from '../../app-child-handler';

const model = require('../../../../modules/model.js')
const all = require('async-all')
import roadtrip from 'roadtrip';

// const UUID_V4_REGEX = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}'

export default class TasksHandler extends AppChildHandler {
    constructor(parent) {
		super(Component, parent);
	}

    protected beforeEnter(current, previous) {
        super.beforeEnter(current, previous);                
        if (this.isLoggedIn()) {
            const topicId = current.params.topicId;
            console.log('beforeEnter - topicId', topicId);
            const topic = model.getTopic.bind(null, topicId);
            const tasks = model.getTasks.bind(null, topicId);
            roadtrip.options = { topicId, topic, tasks };
        }
    }

 	protected activate(component) {
        const topicId = component.get('topicId');
        console.log('activate - topicId', topicId);

        component.on('newTaskKeyup', function(e) {
            const newTaskName = component.get('newTaskName')
            if (e.keyCode === 13 && newTaskName) {
                createNewTask(newTaskName)
                component.set({
                    newTaskName: ''
                })
            }
        })

        component.on('remove', function(taskIndex) {
            const topicId = component.get('topicId')
            let tasksWithIndexElementRemoved = component.get('tasks').slice()

            tasksWithIndexElementRemoved.splice(taskIndex, 1)
            console.log('tasksWithIndexElementRemoved', topicId, tasksWithIndexElementRemoved)

            component.set({
                tasks: tasksWithIndexElementRemoved
            })

            model.saveTasks(topicId, tasksWithIndexElementRemoved)
        })

        function createNewTask(taskName) {
            const task = model.saveTask(topicId, taskName)
            const newTasks = component.get('tasks').concat(task)
            component.set({
                tasks: newTasks
            })
        }

        // component.findElement('.add-new-task').focus()
    }

	protected enter(current, previous) {
		super.enter(current, previous);
		this.activate(this.component);
    }
}

// export default function(stateRouter: IStateRouter) {
// 	stateRouter.addState({
// 		name: 'app.topics.tasks',
// 		route: '/:topicId(' + UUID_V4_REGEX + ')',
// 		template: {
// 			component: Component,
// 			options: {
// 				methods: {
// 					setTaskDone: function(index, done) {
// 						const topicId = this.get('topicId')
// 						const tasks = this.get('tasks').slice()
// 						tasks[index].done = done

// 						this.set({ tasks })

// 						model.saveTasks(topicId, tasks)
// 					}
// 				}
// 			}
// 		},
// 		resolve: function(data, parameters, cb) {
// 			all({
// 				topic: model.getTopic.bind(null, parameters.topicId),
// 				tasks: model.getTasks.bind(null, parameters.topicId),
// 				topicId: parameters.topicId
// 			}, cb)
// 		},
// 		activate: function(context) {
// 			const component = context.domApi
// 			const topicId = context.parameters.topicId
// 			console.log('activate - topicId', topicId)
// 			component.on('newTaskKeyup', function(e) {
// 				const newTaskName = component.get('newTaskName')
// 				if (e.keyCode === 13 && newTaskName) {
// 					createNewTask(newTaskName)
// 					component.set({
// 						newTaskName: ''
// 					})
// 				}
// 			})

// 			component.on('remove', function(taskIndex) {
// 				const topicId = component.get('topicId')
// 				let tasksWithIndexElementRemoved = component.get('tasks').slice()

// 				tasksWithIndexElementRemoved.splice(taskIndex, 1)
// 				console.log('tasksWithIndexElementRemoved', topicId, tasksWithIndexElementRemoved)

// 				component.set({
// 					tasks: tasksWithIndexElementRemoved
// 				})

// 				model.saveTasks(topicId, tasksWithIndexElementRemoved)
// 			})

// 			function createNewTask(taskName) {
// 				// const parentTopicId = component.get('topicId')
// 				//console.log('topicId', topicId, 'parentTopicId', parentTopicId)				
// 				// console.log('context.parameters.topicId', context.parameters.topicId)
// 				const task = model.saveTask(topicId, taskName)
// 				const newTasks = component.get('tasks').concat(task)
// 				component.set({
// 					tasks: newTasks
// 				})
// 			}

// 			component.findElement('.add-new-task').focus()
// 			// (<HTMLElement>component.mountedToTarget.querySelector('.add-new-task')).focus()
// 		}
// 	})

// 	stateRouter.addState({
// 		name: 'app.topics.no-task',
// 		route: '',
// 		template: NoTaskSelected
// 	})
// }
