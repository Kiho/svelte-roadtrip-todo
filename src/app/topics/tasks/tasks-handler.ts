import Tasks from './tasks.html';
import NoTaskSelected from './no-task-selected.html';
import { allWithMapAsync } from '../../../handlers/async';
import AppChildHandler from '../../app-child-handler';
import roadtrip from 'roadtrip';

const model = require('../../../../modules/model.js');

// const UUID_V4_REGEX = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}'

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
        super(path, Tasks, parent, options);
	}

    protected async getData() {
        const topicId = this.routeData.params.topicId;
        const topic = model.getTopicAsync(topicId);
        const tasks = model.getTasksAsync(topicId);
        return allWithMapAsync({topic, tasks, topicId});
    }
    
 	public activate(component: Tasks) {
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
            el.focus();
        }
    }
}