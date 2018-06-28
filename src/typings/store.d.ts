declare module "svelte/store.js" {
    export class Store {
        constructor(options: {});
    
        get(name?: string);
        set(data: any);
    }
}