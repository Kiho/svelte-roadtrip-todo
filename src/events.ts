import  { EventEmitter } from 'events';

export default {
    events: new EventEmitter(),
    isActive: (location, pathTo) => {
        if (pathTo == '/') { pathTo = '/app/topics'}
        if (pathTo.length > 1){
            return location.indexOf(pathTo.substring(1)) > -1;
        }
        return false;
    }
};