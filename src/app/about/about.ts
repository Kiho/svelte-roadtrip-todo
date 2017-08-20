import component from './about.html'

export default function(stateRouter) {
	stateRouter.addState({
		name: 'app.about',
		route: '/about',
 		template: component
	})
}
