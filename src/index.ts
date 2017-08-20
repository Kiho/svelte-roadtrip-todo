
import SvelteRenderer from './router/svelte-state-renderer'
import StateRouter from 'abstract-state-router'
import domready from 'domready'

import Login from './login/login'
import App from './app/app'

domready(function() {
	const stateRouter = StateRouter(SvelteRenderer({}), document.querySelector('body'))

	stateRouter.setMaxListeners(20)

	Login(stateRouter)
	App(stateRouter)

	stateRouter.evaluateCurrentRoute('login')
})
