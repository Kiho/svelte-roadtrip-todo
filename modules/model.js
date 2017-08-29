var uuid4 = require('random-uuid-v4')
var EventEmitter = require('events').EventEmitter

var artificialDelay = 50

var emitter = new EventEmitter()

module.exports = emitter

emitter.getTopics = getTopics
emitter.getTopic = getTopic
emitter.addTopic = addTopic
emitter.removeTopic = removeTopic
emitter.getTasks = getTasks
emitter.saveTasks = saveTasks
emitter.saveTopics = saveTopics
emitter.getCurrentUser = getCurrentUser
emitter.saveCurrentUser = saveCurrentUser
emitter.saveTask = saveTask

emitter.getTopicAsync = getTopicAsync
emitter.getTasksAsync = getTasksAsync

function getTopicAsync(topicId) {
	return new Promise((resolve, reject) => setTimeout(resolve, artificialDelay, getTopicSync(topicId)))
}

function getTasksAsync(topicId) {
	return new Promise((resolve, reject) => setTimeout(resolve, artificialDelay, getTasksSync(topicId)))
}

function getTopics(cb) {
	setTimeout(function() {
		cb(null, getTopicsSync())
	}, artificialDelay)
}

function getTopicsSync() {
	return JSON.parse(localStorage.getItem('topics'))
}

function getTopic(topicId, cb) {
	setTimeout(function() {
		cb(null, getTopicSync(topicId))
	}, artificialDelay)
}

function getTopicSync(topicId) {
	return getTopicsSync().find(function(topic) {
		return topic.id === topicId
	})
}

function addTopic(name) {
	var topic = {
		name: name,
		id: uuid4()
	}

	var topics = getTopicsSync()

	topics.push(topic)

	saveTasks(topic.id, [])
	saveTopics(topics)

	return topic
}

function removeTopic(topicId) {
	var topics = getTopicsSync()
	var index = topics.findIndex(function(topic) {
		return topic.id === topicId
	})
	topics.splice(index, 1)

	saveTopics(topics)
	process.nextTick(function() {
		localStorage.removeItem(topicId)
	})
}

function getTasks(topicId, cb) {
	if (typeof topicId === 'function') {
		cb = topicId
		topicId = null
	}

	setTimeout(function() {
		if (topicId) {
			cb(null, getTasksSync(topicId))
		} else {
			cb(null, getTasksMap())
		}
	}, artificialDelay)
}

function getTasksMap() {
	var topics = getTopicsSync()

	return topics.reduce(function(map, topic) {
		var topicId = topic.id
		map[topicId] = getTasksSync(topicId)
		return map
	}, {})
}

function getTasksSync(topicId) {
	var json = localStorage.getItem(topicId)
	return json ? JSON.parse(localStorage.getItem(topicId)) : []
}

function saveTask(topicId, newTaskName) {
	var topicTasks = getTasksSync(topicId)
	var task = {
		name: newTaskName,
		done: false
	}
	topicTasks.push(task)
	saveTasks(topicId, topicTasks)

	return task
}

function saveTasks(topicId, topicTasks) {
	localStorage.setItem(topicId, JSON.stringify(topicTasks))
	emitter.emit('tasks saved', topicId)
}

function saveTopics(topics) {
	localStorage.setItem('topics', JSON.stringify(topics))

	emitter.emit('topics saved')
}

function getCurrentUser() {
	return {
		name: localStorage.getItem('currentUserName')
	}
}

function saveCurrentUser(username) {
	if (username) {
		localStorage.setItem('currentUserName', username)
	} else {
		localStorage.removeItem('currentUserName')
	}
}

(function initialize() {
	if (!localStorage.getItem('topics')) {
		initializeDummyData()
	}
})()

function initializeDummyData() {
	console.log('Initializing dummy data')

	var topic1 = {
		name: 'Important stuff',
		id: uuid4()
	}
	var topic2 = {
		name: 'Not as important',
		id: uuid4()
	}

	saveTopics([ topic1, topic2 ])

	saveTasks(topic1.id, [{
		name: 'Put on pants',
		done: false
	}, {
		name: 'Visit chat room to see if you still pass the Turing test',
		done: false
	}])

	saveTasks(topic2.id, [{
		name: 'Make cupcakes',
		done: true
	}, {
		name: 'Eat cupcakes',
		done: true
	}, {
		name: 'Write forum post rant about how chocolate cupcakes are the only good kind of cupcake',
		done: false
	}])
}
