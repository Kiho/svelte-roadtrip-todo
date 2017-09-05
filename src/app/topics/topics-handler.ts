import all from 'async-all'
import Component from './topics.html';
import NoTaskSelected from './tasks/no-task-selected.html';
import roadtrip from 'roadtrip';
import GenericHandler from '../../handlers/generic-handler';
import AppChildHandler from '../app-child-handler';

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
    constructor(path, parent) {
		super(path, Component, parent);
	}
	
 	public activate(component, current) {
		const topics = getTopicsSync();
		const tasks = getTasksMap(topics);
		const self = this;

		component.set({ 
			topics: topics,
			tasks: tasks,
		});

		function setFocusOnAddTopicEdit() {
			process.nextTick(function() {
				self.findElement('.new-topic-name').focus();
			});
		}

		function recalculateTasksLeftToDoInTopic(topicId) {
			model.getTasks(topicId, function(err, tasks) {
				const leftToDo =  tasks.reduce(function(toDo, task) {
					return toDo + (task.done ? 0 : 1)
				}, 0);

				component.set({
					tasksUndone: Object.assign({}, component.get('tasksUndone'), {
						[topicId]: leftToDo
					})
				});
			});
		}

		model.on('tasks saved', recalculateTasksLeftToDoInTopic);
		component.on('destroy', () => {
			model.removeListener('tasks saved', recalculateTasksLeftToDoInTopic);
			console.log('model.removeListener - tasks saved'); 
		});

		topics.forEach(function(topic) {
			recalculateTasksLeftToDoInTopic(topic.id);
		});
		
		component.on('add-topic', function() {
			const addingTopic = component.get('addingTopic');
			const newTopicName = component.get('newTopic');

			if (addingTopic && newTopicName) {
				const newTopic = model.addTopic(newTopicName)

				component.set({
					topics: component.get('topics').concat(newTopic),
					newTopic: ''
				});

				recalculateTasksLeftToDoInTopic(newTopic.id);
				roadtrip.goto('/app/topics/' + newTopic.id);
			} else if (!addingTopic) {
				setFocusOnAddTopicEdit();
			}

			component.set({
				addingTopic: !addingTopic
			});
		});

		this.addChildComponent(component, NoTaskSelected, 'uiView');
	}
}
