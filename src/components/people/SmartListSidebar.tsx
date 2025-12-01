'use client';

import { SmartList } from '@/lib/definitions/backend/smartList';
import CreateSmartListModal from './CreateSmartListModal';

interface SmartListSidebarProps {
    userId: string;
    smartLists: SmartList[];
    activeListId: string | null;
    onListClick: (listId: string | null) => void;
    totalContacts: number;
}

export default function SmartListSidebar({
    userId,
    smartLists,
    activeListId,
    onListClick,
    totalContacts
}: SmartListSidebarProps) {
    return (
        <div className="w-64 flex-shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
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
                        <button
                            key={list.ID}
                            onClick={() => onListClick(list.ID)}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${activeListId === list.ID
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <span className="truncate">{list.Name}</span>
                            </div>
                        </button>
                    ))}

                    {/* Create New List Button */}
                    <CreateSmartListModal userId={userId} />
                </div>
            </div>
        </div>
    );
}

