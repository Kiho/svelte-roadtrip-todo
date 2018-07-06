/*
 * This is the entrypoint of all the JavaScript files.
 */

import roadtrip from 'roadtrip';
import Routes from './routes';
import store from './store';

document.addEventListener('DOMContentLoaded', main);
function main () {
    store.set({ routes: new Routes('app-root') });
}