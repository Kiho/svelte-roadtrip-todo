import Component from './tasks.html'
import NoTaskSelected from './no-task-selected.html'

const model = require('../../../../modules/model.js')
const all = require('async-all')

const UUID_V4_REGEX = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}'

export default function(stateRouter: IStateRouter) {
	stateRouter.addState({
		name: 'app.topics.tasks',
		route: '/:topicId(' + UUID_V4_REGEX + ')',
		template: {
			component: Component,
			options: {
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
		},
		resolve: function(data, parameters, cb) {
			all({
				topic: model.getTopic.bind(null, parameters.topicId),
				tasks: model.getTasks.bind(null, parameters.topicId),
				topicId: parameters.topicId
			}, cb)
		},
		activate: function(context) {
			const svelte = context.domApi
			const topicId = context.parameters.topicId
			console.log('activate - topicId', topicId)
			svelte.on('newTaskKeyup', function(e) {
				const newTaskName = svelte.get('newTaskName')
				if (e.keyCode === 13 && newTaskName) {
					createNewTask(newTaskName)
					svelte.set({
						newTaskName: ''
					})
				}
			})

			svelte.on('remove', function(taskIndex) {
				const topicId = this.get('topicId')
				const tasksWithIndexElementRemoved = this.get('tasks').slice()

				tasksWithIndexElementRemoved.splice(taskIndex, 1)

				this.set({
					tasks: tasksWithIndexElementRemoved
				})

				model.saveTasks(topicId, tasksWithIndexElementRemoved)
			})

			function createNewTask(taskName) {
				const parentTopicId = svelte.get('topicId')
				console.log('topicId', topicId, 'parentTopicId', parentTopicId)				
				console.log('context.parameters.topicId', context.parameters.topicId)
				const task = model.saveTask(parentTopicId, taskName)
				const newTasks = svelte.get('tasks').concat(task)
				svelte.set({
					tasks: newTasks
				})
			}

			svelte.findElement('.add-new-task').focus()
			// (<HTMLElement>svelte.mountedToTarget.querySelector('.add-new-task')).focus()
		}
	})

	stateRouter.addState({
		name: 'app.topics.no-task',
		route: '',
		template: NoTaskSelected
	})
}
