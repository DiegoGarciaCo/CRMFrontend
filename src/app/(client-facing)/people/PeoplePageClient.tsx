'use client';

import { Contact } from '@/lib/definitions/backend/contacts';
import { SmartList } from '@/lib/definitions/backend/smartList';
import { useState, useMemo } from 'react';
import SmartListSidebar from '@/components/people/SmartListSidebar';
import ContactsTable from '@/components/people/ContactsTable';
import ContactDetailsDrawer from '@/components/people/ContactDetailsDrawer';

interface PeoplePageClientProps {
    initialContacts: Contact[];
    smartLists: SmartList[];
}

export default function PeoplePageClient({ initialContacts, smartLists }: PeoplePageClientProps) {
    const [activeListId, setActiveListId] = useState<string | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Filter contacts based on active smart list
    const filteredContacts = useMemo(() => {
        if (!activeListId) {
            return initialContacts;
        }

        const activeList = smartLists.find((list) => list.ID === activeListId);
        if (!activeList || !activeList.FilterCriteria) {
            return initialContacts;
        }

        // Apply filter criteria
        // Note: FilterCriteria is JSON - you'll need to implement your filtering logic
        // based on your backend's filter structure
        try {
            const criteria = activeList.FilterCriteria;

            return initialContacts.filter((contact) => {
                // Example filter logic - adjust based on your actual filter criteria structure
                if (criteria.status && contact.Status.Valid) {
                    if (Array.isArray(criteria.status)) {
                        if (!criteria.status.includes(contact.Status.String)) return false;
                    } else if (contact.Status.String !== criteria.status) {
                        return false;
                    }
                }

                if (criteria.source && contact.Source.Valid) {
                    if (Array.isArray(criteria.source)) {
                        if (!criteria.source.includes(contact.Source.String)) return false;
                    } else if (contact.Source.String !== criteria.source) {
                        return false;
                    }
                }

                if (criteria.priceRange && contact.PriceRange.Valid) {
                    if (contact.PriceRange.String !== criteria.priceRange) return false;
                }

                return true;
            });
        } catch (error) {
            console.error('Error filtering contacts:', error);
            return initialContacts;
        }
    }, [initialContacts, activeListId, smartLists]);

    const handleContactClick = (contact: Contact) => {
        window.location.replace(`/people/${contact.ID}`);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        // Delay clearing selected contact to allow animation to complete
        setTimeout(() => setSelectedContact(null), 300);
    };

    return (
        <>
            <SmartListSidebar
                smartLists={smartLists}
                activeListId={activeListId}
                onListClick={setActiveListId}
                totalContacts={initialContacts.length}
            />

            <div className="flex-1 overflow-auto">
                <div className="mx-auto max-w-7xl p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                            {activeListId
                                ? smartLists.find((list) => list.ID === activeListId)?.Name || 'People'
                                : 'All Contacts'}
                        </h1>
                        {activeListId && (
                            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                {smartLists.find((list) => list.ID === activeListId)?.Description.Valid &&
                                    smartLists.find((list) => list.ID === activeListId)?.Description.String}
                            </p>
                        )}
                    </div>

                    {/* Contacts Table */}
                    <ContactsTable
                        contacts={filteredContacts}
                        onContactClick={handleContactClick}
                    />
                </div>
            </div>

            {/* Contact Details Drawer */}
            <ContactDetailsDrawer
                contact={selectedContact}
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
            />
        </>
    );
}

