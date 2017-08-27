import all from 'async-all'
import Component from './topics.html'
import roadtrip from 'roadtrip';
import GenericHandler from '../../generic-handler';
import AppChildHandler from '../app-child-handler';
// import Tasks from './tasks/tasks'

const model = require('../../../modules/model.js')

function getTopicsSync() {
	return JSON.parse(localStorage.getItem('topics'))
}

export default class TopicsHandler extends AppChildHandler {
    constructor(parent) {
		super(Component, parent);
	}
	
 	protected activate(component) {
		const topics = getTopicsSync();
		component.set({ topics: topics });

		component.on('add-topic', function() {
			const addingTopic = component.get('addingTopic')
			const newTopicName = component.get('newTopic')

			if (addingTopic && newTopicName) {
				const newTopic = model.addTopic(newTopicName)

				component.set({
					topics: component.get('topics').concat(newTopic),
					newTopic: ''
				})

				// recalculateTasksLeftToDoInTopic(newTopic.id)
				roadtrip.goto('/app/topics/tasks', {
					topicId: newTopic.id
				})
			} else if (!addingTopic) {
				// setFocusOnAddTopicEdit()
			}

			component.set({
				addingTopic: !addingTopic
			})
		})
	}

	protected enter(current, previous) {
		super.enter(current, previous);
		this.activate(this.component);
    }
}

// export default function(stateRouter) {
// 	stateRouter.addState({
// 		name: 'app.topics',
// 		route: '/topics',
// 		defaultChild: 'no-task',
// 		template: Component,
// 		resolve: function(data, parameters, cb) {
// 			all({
// 				topics: model.getTopics,
// 				tasks: model.getTasks
// 			}, cb)
// 		},
// 		activate: function(context) {
// 			const component = context.domApi

// 			function setFocusOnAddTopicEdit() {
// 				process.nextTick(function() {
// 					component.findElement('.new-topic-name').focus()
// 					// (<HTMLElement>component.mountedToTarget.querySelector('.new-topic-name')).focus()
// 				})
// 			}

// 			function recalculateTasksLeftToDoInTopic(topicId) {
// 				model.getTasks(topicId, function(err, tasks) {
// 					const leftToDo =  tasks.reduce(function(toDo, task) {
// 						return toDo + (task.done ? 0 : 1)
// 					}, 0)

// 					component.set({
// 						tasksUndone: Object.assign({}, component.get('tasksUndone'), {
// 							[topicId]: leftToDo
// 						})
// 					})
// 				})
// 			}

// 			model.on('tasks saved', recalculateTasksLeftToDoInTopic)

// 			context.content.topics.forEach(function(topic) {
// 				recalculateTasksLeftToDoInTopic(topic.id)
// 			})

// 			component.on('add-topic', function() {
// 				const addingTopic = component.get('addingTopic')
// 				const newTopicName = component.get('newTopic')

// 				if (addingTopic && newTopicName) {
// 					const newTopic = model.addTopic(newTopicName)

// 					component.set({
// 						topics: component.get('topics').concat(newTopic),
// 						newTopic: ''
// 					})

// 					recalculateTasksLeftToDoInTopic(newTopic.id)
// 					stateRouter.go('app.topics.tasks', {
// 						topicId: newTopic.id
// 					})
// 				} else if (!addingTopic) {
// 					setFocusOnAddTopicEdit()
// 				}

// 				component.set({
// 					addingTopic: !addingTopic
// 				})

// 				return false
// 			})

// 			context.on('destroy', function() {
// 				model.removeListener('tasks saved', recalculateTasksLeftToDoInTopic)
// 			})
// 		}
// 	})

// 	Tasks(stateRouter)
// }
