interface TasksOptions      { newTaskName?: string;
topic?: {};
tasks?: any[];
}
declare class Tasks extends ISvelte<TasksOptions>
{
    complete: (taskIndex: any) => void;
   restore: (taskIndex: any) => void;
}
export default Tasks