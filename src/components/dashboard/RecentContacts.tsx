'use client';

import { Contact } from '@/lib/definitions/backend/contacts';
import Link from 'next/link';

interface RecentContactsProps {
    contacts: Contact[];
}

export default function RecentContacts({ contacts }: RecentContactsProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'active':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'qualified':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'negotiating':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            default:
                return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
        }
    };

    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Recent Contacts</h2>
                <Link
                    href="/people"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    View All
                </Link>
            </div>
            <div className="space-y-3">
                {(contacts ?? []).length === 0 ? (
                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-500 py-8">No recent contacts</p>
                ) : (
                    contacts.map((contact) => (
                        <div
                            key={contact.ID}
                            className="flex items-start justify-between rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                        >
                            <button
                                onClick={() => {
                                    window.location.href = `/people/${contact.ID}`;
                                }}
                                className="flex w-full items-center gap-4 text-left"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                                            {contact.FirstName} {contact.LastName}
                                        </h3>
                                        {contact.Status.Valid && (
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(contact.Status.String)}`}>
                                                {contact.Status.String}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-500">
                                        {contact.Source.Valid && (
                                            <div className="flex items-center gap-1">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                <span>{contact.Source.String}</span>
                                            </div>
                                        )}
                                        {contact.PriceRange.Valid && (
                                            <div className="flex items-center gap-1">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{contact.PriceRange.String}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Added {formatDate(contact.CreatedAt.Valid ? contact.CreatedAt.Time : null)}</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

