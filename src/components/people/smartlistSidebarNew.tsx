'use client';

import { useState, useEffect } from 'react';
import { SmartList } from '@/lib/definitions/backend/smartList';
import { Tag } from '@/lib/definitions/backend/tag';
import SmartListFilterModal from './SmartListFilterModal';
import CreateSmartListModal from './CreateSmartListModal';
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReorderSmartLists } from '@/lib/data/backend/clientCalls';

interface SmartListSidebarProps {
    smartLists: SmartList[];
    activeListId: string | null;
    onListClick: (listId: string | null) => void;
    totalContacts: number;
    Tags: Tag[];
}

function SortableSmartListItem({
    list,
    activeListId,
    onListClick,
    handleFilterClick,
}: {
    list: SmartList;
    activeListId: string | null;
    onListClick: (listId: string | null) => void;
    handleFilterClick: (list: SmartList, e: React.MouseEvent) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: list.ID });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative">
            <div className="flex items-center gap-1">
                {/* Container for filter icon (default) and drag handle (on hover) */}
                <div className="relative flex-shrink-0 w-8 h-8">
                    {/* Filter icon - shows by default */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
                        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </div>

                    {/* Drag handle - shows on hover */}
                    <button
                        {...listeners}
                        {...attributes}
                        className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Drag to reorder"
                        onClick={(e) => e.preventDefault()}
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 8h16M4 16h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* Main list button */}
                <button
                    onClick={() => onListClick(list.ID)}
                    className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${activeListId === list.ID
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                        }`}
                >
                    <div className="flex flex-1 items-center justify-between gap-2">
                        <span className="truncate">{list.Name}</span>

                        {/* Contact count - hidden on hover, filter icon shows instead */}
                        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 group-hover:opacity-0 transition-opacity">
                            {list.ContactCount}
                        </span>
                    </div>
                </button>

                {/* Filter button - shows on hover in place of contact count */}
                <button
                    onClick={(e) => handleFilterClick(list, e)}
                    className="absolute right-2 flex-shrink-0 rounded-lg p-2 opacity-0 transition-opacity hover:bg-zinc-100 group-hover:opacity-100 dark:hover:bg-zinc-800"
                    title="Edit filters"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function SmartListSidebarNew({
    smartLists,
    activeListId,
    onListClick,
    totalContacts,
    Tags,
}: SmartListSidebarProps) {
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [selectedList, setSelectedList] = useState<SmartList | null>(null);
    const [localLists, setLocalLists] = useState<SmartList[]>([]);
    const [draggingItem, setDraggingItem] = useState<SmartList | null>(null);

    // Sync local lists with prop changes
    useEffect(() => {
        setLocalLists([...smartLists].sort((a, b) => a.ListIndex - b.ListIndex));
    }, [smartLists]);

    const handleFilterClick = (list: SmartList, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedList(list);
        setFilterModalOpen(true);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        })
    );

    const handleDragStart = (event: any) => {
        const list = localLists.find((l) => l.ID === event.active.id) || null;
        setDraggingItem(list);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setDraggingItem(null);

        if (!over || active.id === over.id) return;

        const oldIndex = localLists.findIndex((l) => l.ID === active.id);
        const newIndex = localLists.findIndex((l) => l.ID === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newOrder = arrayMove(localLists, oldIndex, newIndex).map((list, idx) => ({
            ...list,
            ListIndex: idx + 1,
        }));

        setLocalLists(newOrder);

        try {
            await ReorderSmartLists(newOrder);
        } catch (err) {
            console.error('Failed to update smart list order', err);
            // Revert on error
            setLocalLists([...smartLists].sort((a, b) => a.ListIndex - b.ListIndex));
        }
    };

    return (
        <>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="w-68 flex-shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 max-h-screen overflow-y-auto">
                    <div className="p-4">
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                            Smart Lists
                        </h2>

                        <div className="space-y-1">
                            {/* All Contacts */}
                            <button
                                onClick={() => onListClick(null)}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${activeListId === null
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>All Contacts</span>
                                </div>
                                <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                    {totalContacts}
                                </span>
                            </button>

                            {/* Divider */}
                            {localLists.length > 0 && (
                                <div className="my-2 border-t border-zinc-200 dark:border-zinc-800"></div>
                            )}

                            {/* Sortable Smart Lists */}
                            <SortableContext
                                items={localLists.map((l) => l.ID)}
                                strategy={verticalListSortingStrategy}
                            >
                                {localLists.map((list) => (
                                    <SortableSmartListItem
                                        key={list.ID}
                                        list={list}
                                        activeListId={activeListId}
                                        onListClick={onListClick}
                                        handleFilterClick={handleFilterClick}
                                    />
                                ))}
                            </SortableContext>

                            {/* Create New List */}
                            <CreateSmartListModal />
                        </div>
                    </div>
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                    {draggingItem ? (
                        <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 shadow-lg border border-zinc-200 dark:border-zinc-700">
                            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="text-sm font-medium">{draggingItem.Name}</span>
                            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                {draggingItem.ContactCount}
                            </span>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Filter Modal */}
            {selectedList && (
                <SmartListFilterModal
                    isOpen={filterModalOpen}
                    onClose={() => setFilterModalOpen(false)}
                    smartList={selectedList}
                    tags={Tags}
                />
            )}
        </>
    );
}
