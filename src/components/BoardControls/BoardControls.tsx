import { Filters } from "@components/BoardControls";
import { Search } from "@components/BoardControls";
import { NewColumn } from "@components/BoardControls";
import type { COMPLETION_FILTER } from "../../context";

import './BoardControls.scss';

type BoardControlsProps = {
    completionFilter: COMPLETION_FILTER;
    handleFilterClick: (filter: COMPLETION_FILTER) => void;
    addColumn: (title: string) => void;
};

export const BoardControls = (props: BoardControlsProps) => {
    const {
        completionFilter,
        handleFilterClick,
        addColumn
    } = props;

    return (
        <div className="board-controls">
            <Filters filter={completionFilter} onClick={handleFilterClick}/>
            <NewColumn addColumn={addColumn} />
            <Search />
    </div>
    )
}