import React, { createContext, useState, useContext, type ReactNode } from 'react';

import { useColumns } from '../hooks';
import { type ITask } from '@components/Task';
import { type IColumn } from '@components/Column';

export type COMPLETION_FILTER = 'all' | 'completed' | 'incomplete';

interface TaskContextType {
    columns: IColumn[];
    searchTerm: string;
    completionFilter: COMPLETION_FILTER;
    setSearchTerm: (term: string) => void;
    setCompletionFilter: (filter: COMPLETION_FILTER) => void;
    addColumn: (title: string) => void;
    deleteColumn: (colId: string) => void;
    addTask: (colId: string, text: string) => void;
    deleteTask: (colId: string, taskId: string) => void;
    toggleTaskComplete: (colId: string, taskId: string) => void;
    updateTaskTitle: (colId: string, taskId: string, text: string) => void;
    selectTask: (colId: string, taskId: string, selected: boolean) => void;
    selectAllInColumn: (colId: string, selected: boolean) => void;
    deleteSelectedTasks: (colId: string) => void;
    completeSelectedTasks: (colId: string, completed: boolean) => void;
    moveSelectedTasks: (sourceColId: string, targetColId: string) => void;
    moveTask: (sourceColId: string, targetColId: string, taskId: string, targetIndex?: number) => void;
    moveColumn: (sourceColId: string, targetColId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const {
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
   } = useColumns();

    const [searchTerm, setSearchTerm] = useState('');
    const [completionFilter, setCompletionFilter] = useState<COMPLETION_FILTER>('all');

    // Drag-and-drop operations
    const moveTask = (
        sourceColId: string,
        targetColId: string,
        taskId: string,
        targetIndex?: number
    ) => {
        setColumns(prev => {
            let taskToMove: ITask | null = null;
            const newCols = prev.map(col => {
                if (col.id === sourceColId) {
                    const filtered = col.tasks.filter(task => {
                        if (task.id === taskId) {
                            taskToMove = task;
                            return false;
                        }
                        return true;
                    });
                    return { ...col, tasks: filtered };
                }
                return col;
            });
            if (!taskToMove) return prev;
            return newCols.map(col => {
                if (col.id === targetColId) {
                    const newTasks = [...col.tasks];
                    if (targetIndex === undefined || targetIndex < 0 || targetIndex > newTasks.length) {
                        newTasks.push(taskToMove!);
                    } else {
                        newTasks.splice(targetIndex, 0, taskToMove!);
                    }
                    return { ...col, tasks: newTasks };
                }
                return col;
            });
        });
    };

    const moveColumn = (sourceColId: string, targetColId: string) => {
        setColumns(prev => {
            const newCols = [...prev];
            const fromIndex = newCols.findIndex(col => col.id === sourceColId);
            const toIndex = newCols.findIndex(col => col.id === targetColId);
            if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return prev;
            // Remove the column from its position
            const [moved] = newCols.splice(fromIndex, 1);
            // Insert it after the target (or before, depending on position)
            const insertIndex = toIndex < fromIndex ? toIndex : toIndex + 1;
            newCols.splice(insertIndex, 0, moved);
            return newCols;
        });
    };

    return (
        <TaskContext.Provider
            value={{
                columns,
                searchTerm,
                completionFilter,
                setSearchTerm,
                setCompletionFilter,
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
                moveSelectedTasks,
                moveTask,
                moveColumn,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => {
    const ctx = useContext(TaskContext);
    if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
    return ctx;
};
