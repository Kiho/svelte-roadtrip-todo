import all from 'async-all'
import Component from './topics.html'
import roadtrip from 'roadtrip';
import GenericHandler from '../../generic-handler';
// import Tasks from './tasks/tasks'

declare var process;

const model = require('../../../modules/model.js')

function getTopicsSync() {
	return JSON.parse(localStorage.getItem('topics'))
}

export default class TopicsHandler extends GenericHandler {
    constructor(target) {
		super(Component, target);
	}
	
	// protected async beforeEnter(route) {
	// }

 	protected activate(component) {
		const topics = getTopicsSync();
		component.set({ topics: topics });
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
// 			const svelte = context.domApi

// 			function setFocusOnAddTopicEdit() {
// 				process.nextTick(function() {
// 					svelte.findElement('.new-topic-name').focus()
// 					// (<HTMLElement>svelte.mountedToTarget.querySelector('.new-topic-name')).focus()
// 				})
// 			}

// 			function recalculateTasksLeftToDoInTopic(topicId) {
// 				model.getTasks(topicId, function(err, tasks) {
// 					const leftToDo =  tasks.reduce(function(toDo, task) {
// 						return toDo + (task.done ? 0 : 1)
// 					}, 0)

// 					svelte.set({
// 						tasksUndone: Object.assign({}, svelte.get('tasksUndone'), {
// 							[topicId]: leftToDo
// 						})
// 					})
// 				})
// 			}

// 			model.on('tasks saved', recalculateTasksLeftToDoInTopic)

// 			context.content.topics.forEach(function(topic) {
// 				recalculateTasksLeftToDoInTopic(topic.id)
// 			})

// 			svelte.on('add-topic', function() {
// 				const addingTopic = svelte.get('addingTopic')
// 				const newTopicName = svelte.get('newTopic')

// 				if (addingTopic && newTopicName) {
// 					const newTopic = model.addTopic(newTopicName)

// 					svelte.set({
// 						topics: svelte.get('topics').concat(newTopic),
// 						newTopic: ''
// 					})

// 					recalculateTasksLeftToDoInTopic(newTopic.id)
// 					stateRouter.go('app.topics.tasks', {
// 						topicId: newTopic.id
// 					})
// 				} else if (!addingTopic) {
// 					setFocusOnAddTopicEdit()
// 				}

// 				svelte.set({
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
