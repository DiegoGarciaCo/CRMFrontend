'use client';

import { SmartList } from '@/lib/definitions/backend/smartList';
import { useState } from 'react';
import SmartListFilterModal from './SmartListFilterModal';
import CreateSmartListModal from './CreateSmartListModal';
import { Tag } from '@/lib/definitions/backend/tag';

interface SmartListSidebarProps {
    smartLists: SmartList[];
    activeListId: string | null;
    onListClick: (listId: string | null) => void;
    totalContacts: number;
    Tags: Tag[];
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

    const handleFilterClick = (list: SmartList, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedList(list);
        setFilterModalOpen(true);
    };

    return (
        <>
            <div className="w-68 flex-shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 max-h-screen">
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
                        {smartLists.length > 0 && (
                            <div className="my-2 border-t border-zinc-200 dark:border-zinc-800"></div>
                        )}

                        {/* Smart Lists */}
                        {smartLists.map((list) => (
                            <div key={list.ID} className="group relative">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onListClick(list.ID)}
                                        className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${activeListId === list.ID
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                                            }`}
                                    >
                                        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        <span className="truncate">{list.Name}</span>
                                    </button>
                                    <button
                                        onClick={(e) => handleFilterClick(list, e)}
                                        className="flex-shrink-0 rounded-lg p-2 opacity-0 transition-opacity hover:bg-zinc-100 group-hover:opacity-100 dark:hover:bg-zinc-800"
                                        title="Edit filters"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Create New List Button */}
                        <CreateSmartListModal />
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            {selectedList && (
                <SmartListFilterModal
                    isOpen={filterModalOpen}
                    onClose={() => setFilterModalOpen(false)}
                    smartListId={selectedList.ID}
                    smartListName={selectedList.Name}
                    tags={Tags}
                />
            )}
        </>
    );
}

