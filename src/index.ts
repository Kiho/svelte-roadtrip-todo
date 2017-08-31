/*
 * This is the entrypoint of all the JavaScript files.
 */

import roadtrip from 'roadtrip';
import Routes from './routes';
import Events from './events';

roadtrip.routing = Events;

document.addEventListener('DOMContentLoaded', main);
function main () {
  (window as any).Routes = new Routes('#app-root');
}