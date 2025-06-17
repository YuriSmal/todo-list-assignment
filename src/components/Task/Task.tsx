import React, { useRef, useEffect, useState } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import classNames from 'classnames';

import { Button } from "@components/Common";
import { useTaskContext } from '../../context';

export interface ITask {
    id: string;
    title: string;
    completed: boolean;
    selected: boolean;
}

interface TaskItemProps {
    columnId: string;
    task: ITask;
}

export const Task = ({ columnId, task }: TaskItemProps) => {
    const { id, title, completed, selected } = task;
    const {
        deleteTask,
        toggleTaskComplete,
        updateTaskTitle,
        selectTask,
    } = useTaskContext();

    const [isDragging, setIsDragging] = useState(false);
    const [editing, setEditing] = useState(false);
    const [tempText, setTempText] = useState(title);

    const taskRef = useRef<HTMLDivElement>(null);

    // Make task draggable and drop target for reordering
    useEffect(() => {
        const el = taskRef.current;
        if (!el) return ;
        const cleanup = combine(
            draggable({
                element: el,
                getInitialData: () => ({ type: 'card', cardId: id, columnId }),
                onDragStart: () => setIsDragging(true),
                onDrop: () => setIsDragging(false),
            }),
            dropTargetForElements({
                element: el,
                getData: ({ element, input }) => {
                    // Attach card data and closest edge (top/bottom)
                    const data = { type: 'card', cardId: id, columnId };
                    return attachClosestEdge(data, { element, input, allowedEdges: ['top', 'bottom'] });
                },
                getIsSticky: () => true,
            })
        );
        return cleanup;
    }, [columnId, id]);

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        selectTask(columnId, id, e.target.checked);
    };

    const handleDoubleClick = () => {
        setEditing(true);
    };
    const handleBlur = () => {
        setEditing(false);
        if (tempText.trim() !== title) {
            updateTaskTitle(columnId, id, tempText);
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    };
    const handleDeleteTask = () => deleteTask(columnId, id);
    const handleToggleComplete = () => toggleTaskComplete(columnId, id);

    const taskClasses = classNames('task', {
        dragging: isDragging,
        completed,
    });

    return (
        <div
            className={taskClasses}
            ref={taskRef}
        >
            <div className='task-content'>
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={handleCheckbox}
                />
                {editing ? (
                    <input
                        className="task-edit"
                        value={tempText}
                        onChange={e => setTempText(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                ) : (
                    <span onDoubleClick={handleDoubleClick}>{title}</span>
                )}
            </div>
            {!editing &&
                <div className='task-content'>
                    <Button text='✕' color='danger' onClick={handleDeleteTask}/>
                    <Button text={completed ? '↩' : '✓'} onClick={handleToggleComplete}/>
                </div>
            }
        </div>
    );
};

type AddTaskProps = {
    onAddTask: (colId: string, text: string) => void;
    id: string;
}

export const AddTask = (props: AddTaskProps) => {
    const { id, onAddTask } = props;

    const [newTaskText, setNewTaskText] = useState('');

    const handleAddTask = () => {
        onAddTask(id, newTaskText);
        setNewTaskText('');
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onAddTask(id, newTaskText);
            setNewTaskText('');
        }
    }

    return (
        <div className="task-add">
            <input
                type="text"
                placeholder="New task..."
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Button text='Add' onClick={handleAddTask} />
        </div>
    )
}
