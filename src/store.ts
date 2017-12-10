import { Store } from 'svelte/store.js';

const initialState = { currentPath: '' };

class AppState extends Store {
    constructor(options) {
        super(options);
    }

    setCurrentPath(currentPath: string) {
        this.set({ currentPath });
    }
}

const store = new AppState(initialState);

export default store;