import {type ITask, Task} from "@components/Task";

import './TaskList.scss';

type TasksListProps = {
    tasks: ITask[];
    columnId: string;
}

export const TasksList = ({tasks, columnId}: TasksListProps) => {
    return (
        <div className="task-list">
            {!tasks.length && <p>Create your first task!</p>}
            {tasks.map(task => (
                <Task key={task.id} columnId={columnId} task={task} />
            ))}
        </div>
    )
}