import { BoardControls } from '@components/BoardControls';
import { ColumnsList } from '@components/Column';
import { useTaskContext } from '../../context';
import { useDragAndDrop } from '../../hooks';

import './Board.scss';

const Board = () => {
    const {
        columns,
        searchTerm,
        completionFilter,
        setCompletionFilter,
        addColumn,
    } = useTaskContext();

    useDragAndDrop();

    return (
        <div className="board-container">
            <BoardControls
                completionFilter={completionFilter}
                handleFilterClick={setCompletionFilter}
                addColumn={addColumn}
            />
            <div className="board">
                <ColumnsList columns={columns} searchTerm={searchTerm} completionFilter={completionFilter} />
            </div>
        </div>
    );
};

export default Board;
