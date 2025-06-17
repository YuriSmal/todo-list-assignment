import {Column, type IColumn} from "@components/Column";
import type {COMPLETION_FILTER} from "../../context";

type ColumnsListProps = {
    columns: IColumn[];
    searchTerm: string;
    completionFilter?: COMPLETION_FILTER;
};

export const ColumnsList = (props: ColumnsListProps) => {
    const { columns, completionFilter, searchTerm } = props;

    const filteredColumns = columns.map(col => {
        const filteredTasks = col.tasks.filter(task => {
            // Filter by search term
            if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
            // Filter by completion status
            if (completionFilter === 'completed' && !task.completed) return false;
            return !(completionFilter === 'incomplete' && task.completed);

        });
        return { ...col, tasks: filteredTasks };
    });

    return (
        <>
            {!filteredColumns.length && <p className="column-empty">No tasks yet. Start by adding your first column</p>}
            {filteredColumns.map(col => (
                <Column key={col.id} column={col} />
            ))}
        </>
    )
}