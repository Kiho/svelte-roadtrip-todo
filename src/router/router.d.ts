interface IRouteComponent extends Svelte {
    mountedToTarget?: HTMLElement;
    
    findElement(selector: string) : HTMLElement;

    asrReset?: (newData: any) => void;
}

interface IRouteContext {
    element: HTMLElement,

    template: typeof Svelte | { 
        component: typeof Svelte, options: { methods: any } 
    },

    domApi: IRouteComponent;

    parameters;

    content;

    on(
        eventName: string,
        callback?: (event?: any) => any)
        : () => { cancel: () => any };
}

interface IStateRouter {
    addState: (state: {
        name: string,
        route: string,
        defaultChild?: string,
        template: 
            typeof Svelte | { 
            component: typeof Svelte, options: { methods?: any } 
        },
		resolve?: (data, parameters, cb) => any,
		activate?: (context: IRouteContext) => void
    }) => void;

    go(newStateName: string, parameters?, options?);

    makePath(stateName: string, parameters, options);

    stateIsActive(stateName: string, opts);

    evaluateCurrentRoute(defaultState: string, defaultParams?);

    setMaxListeners(max: number);

    on(
        eventName: string,
        callback?: (event?: any) => any)
        : () => { cancel: () => any };

    removeListener(
        eventName: string,
        callback?: () => any);   
}
