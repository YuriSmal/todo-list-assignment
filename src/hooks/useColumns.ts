import { useEffect, useState, useCallback } from "react";
import type {IColumn} from "../components/Column";
import {generateId} from "../utils/utils.ts";

const getColumns = () => {
    const data = localStorage.getItem('todoData');
    if (data) {
        try {
            return JSON.parse(data) as IColumn[];
        } catch {
            return [];
        }
    }

    const initialColumns: IColumn[] = [{ id: generateId(), title: 'To Do', tasks: [] }];
    return initialColumns;
}

export const useColumns = () => {
    const [columns, setColumns] = useState<IColumn[]>(getColumns());

    useEffect(() => {
        localStorage.setItem('todoData', JSON.stringify(columns));
    }, [columns]);

    const addColumn = useCallback((title: string) => {
        const newCol: IColumn = { id: generateId(), title: title || 'Untitled', tasks: [] };
        setColumns(prev => [...prev, newCol]);
    }, []);

    const deleteColumn = useCallback((colId: string) => {
        setColumns(prev => prev.filter(col => col.id !== colId));
    }, []);

    const addTask = (colId: string, title: string) => {
        if (!title.trim()) return;
        setColumns(prev =>
            prev.map(col => {
                if (col.id !== colId) return col;

                return {
                    ...col,
                    tasks: [
                        ...col.tasks,
                        {
                            id: generateId(),
                            title,
                            completed: false,
                            selected: false,
                        },
                    ],
                };
            })
        );
    };
    const deleteTask = (colId: string, taskId: string) => {
        setColumns(prev =>
            prev.map(col =>
                col.id === colId
                    ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
                    : col
            )
        );
    };
    const toggleTaskComplete = (colId: string, taskId: string) => {
        setColumns(prev =>
            prev.map(col =>
                col.id === colId
                    ? {
                        ...col,
                        tasks: col.tasks.map(task =>
                            task.id === taskId ? { ...task, completed: !task.completed } : task
                        ),
                    }
                    : col
            )
        );
    };

    const updateTaskTitle = (colId: string, taskId: string, title: string) => {
        setColumns(prev =>
            prev.map(col =>
                col.id === colId
                    ? {
                        ...col,
                        tasks: col.tasks.map(task =>
                            task.id === taskId ? { ...task, title } : task
                        ),
                    }
                    : col
            )
        );
    };

    const selectTask = (colId: string, taskId: string, selected: boolean) => {
        setColumns(prev =>
            prev.map(col =>
                col.id === colId
                    ? {
                        ...col,
                        tasks: col.tasks.map(task =>
                            task.id === taskId ? { ...task, selected } : task
                        ),
                    }
                    : col
            )
        );
    };

    const selectAllInColumn = (colId: string, selected: boolean) => {
        setColumns(prev =>
            prev.map(col =>
                col.id === colId
                    ? { ...col, tasks: col.tasks.map(task => ({ ...task, selected })) }
                    : col
            )
        );
    };

    const deleteSelectedTasks = (colId: string) => {
        setColumns(prev =>
            prev.map(col =>
                col.id === colId
                    ? { ...col, tasks: col.tasks.filter(task => !task.selected) }
                    : col
            )
        );
    };

    const completeSelectedTasks = (colId: string, completed: boolean) => {
        setColumns(prev =>
            prev.map(col =>
                col.id === colId
                    ? {
                        ...col,
                        tasks: col.tasks.map(task =>
                            task.selected ? { ...task, completed } : task
                        ),
                    }
                    : col
            )
        );
    };

    const moveSelectedTasks = (sourceColId: string, targetColId: string) => {
        if (sourceColId === targetColId) return;
        setColumns(prev => {
            const sourceCol = prev.find(col => col.id === sourceColId);
            const targetCol = prev.find(col => col.id === targetColId);
            if (!sourceCol || !targetCol) return prev;
            const tasksToMove = sourceCol.tasks.filter(task => task.selected);
            if (tasksToMove.length === 0) return prev;
            // Remove selected from source
            const newSourceTasks = sourceCol.tasks.filter(task => !task.selected);
            // Append to target (deselect them)
            const newTargetTasks = [
                ...targetCol.tasks,
                ...tasksToMove.map(t => ({ ...t, selected: false })),
            ];
            return prev.map(col => {
                if (col.id === sourceColId) return { ...col, tasks: newSourceTasks };
                if (col.id === targetColId) return { ...col, tasks: newTargetTasks };
                return col;
            });
        });
    };

    return {
        columns,
        setColumns,
        addColumn,
        deleteColumn,
        addTask,
        deleteTask,
        toggleTaskComplete,
        updateTaskTitle,
        selectTask,
        selectAllInColumn,
        deleteSelectedTasks,
        completeSelectedTasks,
        moveSelectedTasks
    }
}