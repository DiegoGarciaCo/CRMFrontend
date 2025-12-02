'use client';

import { Contact } from '@/lib/definitions/backend/contacts';
import { SmartList } from '@/lib/definitions/backend/smartList';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SmartListSidebar from '@/components/people/SmartListSidebar';
import ContactsTable from '@/components/people/ContactsTable';
import { GetContactsBySmartListID } from '@/lib/data/backend/contacts';
import { Button } from '@/components/ui/button';
import ImportContactsModal from '@/components/people/ImportContactsModal';

interface PeoplePageClientProps {
    userId: string;
    initialContacts: Contact[];
    smartLists: SmartList[];
}

export default function PeoplePageClient({ userId, initialContacts, smartLists }: PeoplePageClientProps) {
    const router = useRouter();
    const [activeListId, setActiveListId] = useState<string | null>(null);
    const [contacts, setContacts] = useState<Contact[]>(initialContacts);
    const [isLoading, setIsLoading] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Fetch filtered contacts when active list changes
    useEffect(() => {
        const fetchFilteredContacts = async () => {
            if (!activeListId) {
                // Show all contacts when no list is active
                setContacts(initialContacts);
                return;
            }

            setIsLoading(true);
            try {
                const filteredContacts = await GetContactsBySmartListID(activeListId);
                setContacts(filteredContacts);
            } catch (error) {
                console.error('Error fetching filtered contacts:', error);
                // Fallback to showing all contacts on error
                setContacts(initialContacts);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilteredContacts();
    }, [activeListId, initialContacts]);

    const handleListClick = (listId: string | null) => {
        setActiveListId(listId);
    };

    const handleFilterUpdate = () => {
        // Refresh the page data to get updated smart list filters
        router.refresh();

        // If a list is active, refetch its contacts
        if (activeListId) {
            GetContactsBySmartListID(activeListId)
                .then((filteredContacts) => {
                    setContacts(filteredContacts);
                })
                .catch((error) => {
                    console.error('Error refetching contacts after filter update:', error);
                });
        }
    };

    const activeList = smartLists.find((list) => list.ID === activeListId);

    const handleImportSuccess = () => {
        // Refresh contacts after successful import
        router.refresh();
        setIsImportModalOpen(false);
    };

    return (
        <div className="flex h-screen">
            <SmartListSidebar
                userId={userId}
                smartLists={smartLists}
                activeListId={activeListId}
                onListClick={handleListClick}
                totalContacts={initialContacts.length}
                onFilterUpdate={handleFilterUpdate}
            />

            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                {activeListId ? activeList?.Name || 'People' : 'All Contacts'}
                            </h1>
                            {activeListId && activeList?.Description.Valid && (
                                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                    {activeList.Description.String}
                                </p>
                            )}
                        </div>
                        <Button
                            onClick={() => setIsImportModalOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Import Contacts
                        </Button>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-500"></div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading contacts...</p>
                            </div>
                        </div>
                    ) : (
                        /* Contacts Table */
                        <ContactsTable contacts={contacts} />
                    )}
                </div>
            </div>

            {/* Import Modal */}
            <ImportContactsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={handleImportSuccess}
                userId={userId}
            />
        </div>
    );
}

