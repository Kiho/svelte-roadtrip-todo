declare module "svelte/store.js" {
    export class Store {
        constructor(options: {});
    
        get(name?: string);
        set(data: any);

        observe(
            name: string,
            callback: (newValue?, oldValue?) => any,
            options?: { init?: boolean, defer?: boolean })
            : () => { cancel: () => any };
    }
}