
	import RouterLink from '../../components/router-link.html';
	import roadtrip from 'roadtrip';
	
	let topics = {
		components: {
            RouterLink
        },
		helpers: {
			hiddenIfNot: x => x ? '' : 'hidden',
			showNumber: x => x ? x : 0
		},
		data: () => ({
			topics: [],
			tasksUndone: {},
			addingTopic: false,
			newTopic: '',
			currentPath: '',
		}),
	}
