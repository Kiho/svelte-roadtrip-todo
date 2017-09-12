import  { EventEmitter } from 'events';
import roadtrip from 'roadtrip';

export default {
    events: new EventEmitter(),
    isActive: (location, pathTo) => {
        if (pathTo == '/') { pathTo = '/app/topics'}
        if (pathTo.length > 1){
            return location.indexOf(pathTo.substring(1)) > -1;
        }
        return false;
    },
    setEvent: (component: Svelte, eventHandler: (...x) => void) => {
        roadtrip.routing.events.on('enter', eventHandler);		
		component.on('destroy', () => {
			roadtrip.routing.events.removeListener('enter', eventHandler);
			console.log('app - roadtrip.routing.events.removeListener - enter');
		});
    }
};