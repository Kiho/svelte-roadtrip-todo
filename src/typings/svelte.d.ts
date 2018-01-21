declare class Svelte {
    constructor(options: { target: Element, data?: any, store?: any });

    get(name?: string): any;
    set(data: any): void;

    on(
        eventName: string,
        callback?: (event?: any) => any)
        : () => { cancel: () => any };

    fire(eventName: string, event?: any);

    observe(
        name: string,
        callback: (newValue?, oldValue?) => any,
        options?: { init?: boolean, defer?: boolean })
        : () => { cancel: () => any };

    oncreate(): void;

    ondestroy(): void;

    destroy(): void;
}

declare class ISvelte<T> extends Svelte {
    get(): T;
    get(name: string): any;
  
    set(data: T): void;
}