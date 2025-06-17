import classNames from 'classnames';
import { useTaskContext } from '../../context';
import { useDragAndDrop } from "../../hooks";
import { TasksList, type ITask, AddTask } from '@components/Task';
import { ColumnActions } from "@components/Column";
import { Button } from "@components/Common";

import './Column.scss';

export interface IColumn {
    id: string;
    title: string;
    tasks: ITask[];
}

interface ColumnProps {
    column: IColumn;
}

export const Column = (props: ColumnProps) => {
    const { column: { id, title, tasks } } = props;
    const {
        addTask,
        deleteColumn,
        selectAllInColumn,
        deleteSelectedTasks,
        completeSelectedTasks,
        moveSelectedTasks,
    } = useTaskContext();

    const {colRef, draggedOver} = useDragAndDrop({ columnId: id });

    const handleDeleteColumn = () => deleteColumn(id);


    const columnClasses = classNames('column', {
        'dragged-over': draggedOver,
    });

    return (
        <div className={columnClasses} ref={colRef}>
            <div className="column-header">
                <h2>{title}</h2>
                <Button text='✕' color='danger' onClick={handleDeleteColumn} />
            </div>
            <ColumnActions
                tasks={tasks}
                columnId={id}
                selectAllInColumn={selectAllInColumn}
                deleteSelectedTasks={deleteSelectedTasks}
                completeSelectedTasks={completeSelectedTasks}
                moveSelectedTasks={moveSelectedTasks}
            />
            <TasksList tasks={tasks} columnId={id} />
            <AddTask onAddTask={addTask} id={id}/>
        </div>
    );
};