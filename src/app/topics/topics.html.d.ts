interface TopicsOptions      { topics?: any[];
tasksUndone?: {};
addingTopic?: boolean;
newTopic?: string;
currentPath?: string;
}
declare class Topics extends ISvelte<TopicsOptions>
{ }
export default Topics