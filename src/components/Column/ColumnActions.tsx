import type {ITask} from "../Task";
import { Button } from "@components/Common";

type ColumnActionsProps = {
    tasks: ITask[];
    columnId: string;
    selectAllInColumn: (colId: string, selected: boolean) => void;
    deleteSelectedTasks: (colId: string) => void;
    completeSelectedTasks: (colId: string, completed: boolean) => void;
    moveSelectedTasks: (sourceColId: string, targetColId: string) => void;
}

export const ColumnActions = (props: ColumnActionsProps) => {
    const {
        tasks,
        columnId,
        selectAllInColumn,
        deleteSelectedTasks,
        completeSelectedTasks,
        moveSelectedTasks
    } = props;

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        selectAllInColumn(columnId, e.target.checked);
    };
    const handleDeleteSelectedTasks = () => deleteSelectedTasks(columnId);
    const handleCompleteSelectedTasks = () => completeSelectedTasks(columnId, true);
    const handleUncompleteSelectedTasks = () => completeSelectedTasks(columnId, false);
    // because of lack of the time, multiple tasks d&d implemented with prompt
    const handleMoveSelectedTasks = () => {
        const target = prompt('Enter target column title to move selected tasks to:');
        if (target) moveSelectedTasks(columnId, target);
    };

    return (
        <div className="column-actions">
            <label>
                <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={tasks.length > 0 && tasks.every(t => t.selected)}
                />
                Select All
            </label>
            <Button text='Delete' color='danger' onClick={handleDeleteSelectedTasks}/>
            <Button text='Complete' onClick={handleCompleteSelectedTasks}/>
            <Button text='Incomplete' onClick={handleUncompleteSelectedTasks}/>
            <Button text='Move Selected' onClick={handleMoveSelectedTasks}/>
        </div>
    )
}