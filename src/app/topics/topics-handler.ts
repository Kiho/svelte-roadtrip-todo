import Component from './topics.html';
import roadtrip from 'roadtrip';
import {allWithAsync} from '../../handlers/async';
import GenericHandler from '../../handlers/generic-handler';
import AppChildHandler from '../app-child-handler';

declare var process;

const model = require('../../../modules/model.js')

export default class TopicsHandler extends AppChildHandler {
    constructor(path, parent) {
		super(path, Component, parent);
	}
	
	protected async getData() {
        const topics = model.getTopicsAsync();
        const tasks = model.getTasksMapAsync(topics);
		return allWithAsync(topics, tasks)
			.then(data => ({ topics: data[0], tasks: data[1] }));
	}
	
 	public activate(component) {
		const self = this;
		const { topics } = component.get();

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
		roadtrip.routing.events.on('enter', routeData => {       
			this.setCurrentPath(component, routeData);
		});		
		component.on('destroy', () => {
			model.removeListener('tasks saved', recalculateTasksLeftToDoInTopic);
			console.log('model.removeListener - tasks saved');
			roadtrip.routing.events.removeListener('enter', this.setCurrentPath);
			console.log('roadtrip.routing.events.removeListener - enter');
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
	}
}
