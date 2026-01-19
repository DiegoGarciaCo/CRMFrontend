'use client';

import { Contact } from '@/lib/definitions/backend/contacts';
import { SmartList } from '@/lib/definitions/backend/smartList';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SmartListSidebar from '@/components/people/SmartListSidebar';
import ContactsTable from '@/components/people/ContactsTable';
import { Button } from '@/components/ui/button';
import ImportContactsModal from '@/components/people/ImportContactsModal';
import { Tag } from '@/lib/definitions/backend/tag';
import { DeleteContacts } from '@/lib/data/backend/clientCalls';
import { useContactsNav } from '@/lib/hooks/UseContactsNav';

interface PeoplePageClientProps {
    userId: string;
    contacts: Contact[];
    smartLists: SmartList[];
    tags: Tag[];
    activeListId: string | null;
    limit?: string;
    offset?: string;
}


export default function PeoplePageClient({ userId, contacts, smartLists, tags, activeListId, limit, offset }: PeoplePageClientProps) {
    const router = useRouter();
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Zustand store for contacts navigation
    const setListId = useContactsNav((state) => state.setListId);
    const setContactIds = useContactsNav((state) => state.setContactIds);
    const setLimit = useContactsNav((state) => state.setLimit);
    const setOffset = useContactsNav((state) => state.setOffset);
    const setTotalPages = useContactsNav((state) => state.setTotalPages);



    useEffect(() => {
        setContactIds(contacts.map((contact, i) => ({ index: i, id: contact.ID })));
        setTotalPages(totalContacts / Number(limit || 25) || 1);
    }, [contacts, setContactIds]);

    const handleListClick = (listId: string | null) => {
        setListId(listId || '');
        router.push(listId ? `/people/?list=${listId}` : '/people');
    };

    const handlePageChange = (newPage: number) => {
        // Update URL with new page
        setOffset((newPage - 1) * Number(limit || 25));
        setLimit(Number(limit || 25));
        router.push(`?limit=${limit || 25}&offset=${(newPage - 1) * Number(limit || 25)}`);
    }

    const totalContacts = contacts[0]?.TotalCount || 0;
    const totalPages = totalContacts / Number(limit || 25) || 1;
    const o = Number(offset);
    const l = Number(limit) || 20;



    const page = Number.isFinite(o) ? Math.floor(o / l) + 1 : 1;

    const activeList = smartLists.find((list) => list.ID === activeListId);

    const handleImportSuccess = () => {
        // Refresh contacts after successful import
        router.refresh();
        setIsImportModalOpen(false);
    };

    const onDeleteContacts = async (contactIds: string[]) => {
        // Implement contact deletion logic here
        await DeleteContacts(contactIds);
        // After deletion, refresh the contacts list
        router.refresh();
    }

    return (
        <div className="flex h-full w-full">
            <SmartListSidebar
                smartLists={smartLists}
                activeListId={activeListId}
                onListClick={handleListClick}
                totalContacts={smartLists[0].TotalContacts}
                Tags={tags}
            />

            <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-900">
                <div className="flex-shrink-0 p-6 border-b border-zinc-200 dark:border-zinc-800">
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

                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Loading State */}
                    <ContactsTable
                        contacts={contacts}
                        currentPage={page}
                        totalPages={totalPages ? Math.ceil(totalPages) : 1}
                        onPageChange={handlePageChange}
                        onDeleteContacts={onDeleteContacts}
                    />
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

