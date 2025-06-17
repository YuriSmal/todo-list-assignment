import {useCallback, useEffect, useRef, useState} from "react";
import {
    monitorForElements,
    type ElementEventBasePayload,
    draggable,
    dropTargetForElements
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {combine} from "@atlaskit/pragmatic-drag-and-drop/combine";
import {useTaskContext} from "../context";

type useDragAndDropProps = {
    columnId?: string;
}

export const useDragAndDrop = (props?: useDragAndDropProps) => {
    const {moveTask, moveColumn, columns} = useTaskContext();
    const { columnId } = props || {};

    const [draggedOver, setDraggedOver] = useState(false);
    const colRef = useRef<HTMLDivElement>(null);

    const handleDrop = useCallback((args: ElementEventBasePayload) => {
            const { source, location } = args;
            if (!source || !location) return;
            // If dropping a task card
            if (source.data.type === 'card') {
                const draggedId = source.data.cardId as string;
                const sourceColId = source.data.columnId as string;
                // Determine drop targets
                const dropTargets = location.current.dropTargets;
                if (dropTargets.length === 0) return;
                // If dropped on a column (no specific card)
                if (dropTargets.length === 1 && dropTargets[0].data.columnId) {
                    const targetColId = dropTargets[0].data.columnId as string;
                    // Move task to end of column
                    moveTask(sourceColId, targetColId, draggedId);
                }
                // If dropped on a target card
                else if (dropTargets[0].data.cardId) {
                    const targetCardId = dropTargets[0].data.cardId as string;
                    const targetColId = dropTargets[1].data.columnId as string;
                    const edge = dropTargets[0].data.closestEdgeOfTarget as string;
                    // Compute index of target card in that column
                    const col = columns?.find(c => c.id === targetColId);
                    if (!col) return;
                    const idx = col.tasks.findIndex(task => task.id === targetCardId);
                    let insertIndex = idx;
                    if (edge === 'bottom') insertIndex = idx + 1;
                    moveTask(sourceColId, targetColId, draggedId, insertIndex);
                }
            }
            // If dropping a column header
            else if (source.data.type === 'column') {
                const draggedColId = source.data.columnId as string;
                const dropTargets = location.current.dropTargets;
                if (dropTargets.length === 0) return;
                const targetColId = dropTargets[0].data.columnId as string;
                moveColumn(draggedColId, targetColId);
            }
        },
        [columns, moveTask, moveColumn]
    );

    useEffect(() => {
        return monitorForElements({ onDrop: handleDrop });
    }, [handleDrop]);

    useEffect(() => {
        const colEl = colRef.current;
        if (!colEl || !columnId) return;
        const cleanup = combine(
            draggable({
                element: colEl,
                getInitialData: () => ({ type: 'column', columnId: columnId }),
            }),
            dropTargetForElements({
                element: colEl,
                onDragEnter: () => setDraggedOver(true),
                onDragLeave: () => setDraggedOver(false),
                onDrop: () => setDraggedOver(false),
                getData: () => ({ columnId: columnId }),
                getIsSticky: () => true,
            })
        );
        return cleanup;
    }, [columnId]);

    return {
        colRef,
        draggedOver,
    }
}