import { type BaseSyntheticEvent} from "react";
import type {COMPLETION_FILTER} from "../../context";
import { Button } from "../Common";

type FiltersProps = {
    filter: COMPLETION_FILTER;
    onClick: (filter: COMPLETION_FILTER) => void;
}

export const Filters = (props: FiltersProps)=> {
    const { filter, onClick } = props;

    const handleFilterClick = (e: BaseSyntheticEvent) => onClick(e.currentTarget.innerText.toLowerCase());
    return (
        <div className="filter-buttons">
            <span>Filter by:</span>
            <Button text='All' color='default' onClick={handleFilterClick} classes={filter === 'all' ? 'selected' : ''}/>
            <Button text='Completed' color='default' onClick={handleFilterClick} classes={filter === 'completed' ? 'selected' : ''}/>
           <Button text='Incomplete' color='default' onClick={handleFilterClick} classes={filter === 'incomplete' ? 'selected' : ''}/>
        </div>
    )
}