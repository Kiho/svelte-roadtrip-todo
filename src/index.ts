/*
 * This is the entrypoint of all the JavaScript files.
 */

import roadtrip from 'roadtrip';
import Routes from './routes';

document.addEventListener('DOMContentLoaded', main);
function main () {
    roadtrip.routing.routes = new Routes('#app-root');
}