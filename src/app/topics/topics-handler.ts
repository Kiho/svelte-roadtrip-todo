import all from 'async-all'
import Component from './topics.html'
import roadtrip from 'roadtrip';
import GenericHandler from '../../generic-handler';
import AppChildHandler from '../app-child-handler';
// import Tasks from './tasks/tasks'
declare var process;

const model = require('../../../modules/model.js')

function getTopicsSync() {
	return JSON.parse(localStorage.getItem('topics'))
}

function getTasksSync(topicId) {
	var json = localStorage.getItem(topicId)
	return json ? JSON.parse(localStorage.getItem(topicId)) : []
}

function getTasksMap(topics) {
	return topics.reduce(function(map, topic) {
		var topicId = topic.id
		map[topicId] = getTasksSync(topicId)
		return map
	}, {})
}

export default class TopicsHandler extends AppChildHandler {
    constructor(parent) {
		super(Component, parent);
	}
	
 	protected activate(component) {
		const topics = getTopicsSync();
		const tasks = getTasksMap(topics);

		component.set({ 
			topics: topics,
			tasks: tasks,
		});

		topics.forEach(function(topic) {
			recalculateTasksLeftToDoInTopic(topic.id)
		});

		function setFocusOnAddTopicEdit() {
			// process.nextTick(function() {
			// 	component.findElement('.new-topic-name').focus()
			// 	// (<HTMLElement>component.mountedToTarget.querySelector('.new-topic-name')).focus()
			// })
		}

		function recalculateTasksLeftToDoInTopic(topicId) {
			model.getTasks(topicId, function(err, tasks) {
				const leftToDo =  tasks.reduce(function(toDo, task) {
					return toDo + (task.done ? 0 : 1)
				}, 0)

				component.set({
					tasksUndone: Object.assign({}, component.get('tasksUndone'), {
						[topicId]: leftToDo
					})
				})
			})
		}

		component.on('add-topic', function() {
			const addingTopic = component.get('addingTopic')
			const newTopicName = component.get('newTopic')

			if (addingTopic && newTopicName) {
				const newTopic = model.addTopic(newTopicName)

				component.set({
					topics: component.get('topics').concat(newTopic),
					newTopic: ''
				})

				recalculateTasksLeftToDoInTopic(newTopic.id)
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
