import merge from 'deepmerge'

const copy = obj => merge({}, obj, { clone: true })

export default function (defaultOptions: { data?: any }) {
	return function makeRenderer(stateRouter: IStateRouter) {
		const asr = {
			makePath: stateRouter.makePath,
			stateIsActive: stateRouter.stateIsActive
		}

		function render(context: IRouteContext, cb: (e, svt?: IRouteComponent) => void) {
			const { element: target, template, content } = context

			const rendererSuppliedOptions = merge(defaultOptions, {
				target,
				data: Object.assign(content, defaultOptions.data, { asr })
			})

			function construct(component, options) {
				return options.methods
					? instantiateWithMethods(component, options, options.methods)
					: new component(options)
			}

			let svelte: IRouteComponent

			try {
				// console.log('render() : typeof template', typeof template)
				if (typeof template === 'function') {
					svelte = construct(template, rendererSuppliedOptions)
				} else {
					const options = merge(rendererSuppliedOptions, template.options)

					svelte = construct(template.component, options)
				}
				svelte.asrReset = createComponentResetter(svelte)
			} catch (e) {
				cb(e)
				return
			}

			function onRouteChange() {
				svelte.set({
					asr
				})
			}

			stateRouter.on('stateChangeEnd', onRouteChange)

			svelte.on('destroy', () => {
				stateRouter.removeListener('stateChangeEnd', onRouteChange)
			})

			svelte.mountedToTarget = target
			svelte.findElement = (selector) => {
				return <HTMLElement>svelte.mountedToTarget.querySelector(selector)
			}

			cb(null, svelte)
		}

		return {
			render,
			reset: function reset(context: IRouteContext, cb) {
				const svelte = context.domApi

				svelte.asrReset(context.content)
				cb()
			},
			destroy: function destroy(svelte: IRouteComponent, cb) {
				svelte.destroy()
				cb()
			},
			getChildElement: function getChildElement(svelte: IRouteComponent, cb:(e, elem?: HTMLElement) => void) {
				try {
					// const element = svelte.mountedToTarget
					// const child = element.querySelector('uiView')
					const child = svelte.findElement('uiView')
					cb(null, child)
				} catch (e) {
					cb(e)
				}
			}
		}
	}
}

function createComponentResetter(component: IRouteComponent) {
	const originalData = copy(component.get())

	return function reset(newData) {
		const resetObject = Object.create(null)
		Object.keys(component.get()).forEach(key => {
			resetObject[key] = undefined
		})
		Object.assign(resetObject, copy(originalData), newData)
		component.set(resetObject)
	}
}

function instantiateWithMethods(component, options, methods) {
	return Object.assign(new component(options), methods)
}