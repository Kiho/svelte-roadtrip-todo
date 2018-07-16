declare class Svelte {
    constructor(options: { target: Element, data?: any, store?: any });

    get(): any;
    set(data: any): void;

    on(eventName: string,
        callback?: (event?: any) => any)
        : () => { cancel: () => any };

    fire(eventName: string, event?: any);

    oncreate(): void;

    ondestroy(): void;

    destroy(): void;

    refs?: RefCollection;
}

interface RefCollection {
    [name: string]: any;
}

declare class ISvelte<T> extends Svelte {
    get(): T;
    get(name: string): any;
  
    set(data: T): void;
}