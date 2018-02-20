
	import RouterLink from '../../components/router-link.html';
	import roadtrip from 'roadtrip';
	
	let topics = {
		components: {
            RouterLink
		},
		data() {
			return {
				topics: [],
				tasksUndone: {},
				addingTopic: false,
				newTopic: '',
				currentPath: ''
			}
		},
		helpers: {
			hiddenIfNot: x => x ? '' : 'hidden',
			showNumber: x => x ? x : 0
		},
	}
