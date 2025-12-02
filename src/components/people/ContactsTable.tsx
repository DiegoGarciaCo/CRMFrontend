'use client';

import { Contact } from '@/lib/definitions/backend/contacts';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ContactsTableProps {
    contacts: Contact[];
}

type SortField = 'name' | 'status' | 'source' | 'created';
type SortDirection = 'asc' | 'desc';

export default function ContactsTableNew({ contacts }: ContactsTableProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('created');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredAndSortedContacts = useMemo(() => {
        const contactsArray = Array.isArray(contacts) ? contacts : [];
        const filtered = contactsArray.filter((contact) => {
            const searchLower = searchTerm.toLowerCase();
            const fullName = `${contact.FirstName} ${contact.LastName}`.toLowerCase();
            const status = contact.Status.Valid ? contact.Status.String.toLowerCase() : '';
            const source = contact.Source.Valid ? contact.Source.String.toLowerCase() : '';

            return fullName.includes(searchLower) || status.includes(searchLower) || source.includes(searchLower);
        });

        filtered.sort((a, b) => {
            let aVal: any, bVal: any;

            switch (sortField) {
                case 'name':
                    aVal = `${a.FirstName} ${a.LastName}`;
                    bVal = `${b.FirstName} ${b.LastName}`;
                    break;
                case 'status':
                    aVal = a.Status.Valid ? a.Status.String : '';
                    bVal = b.Status.Valid ? b.Status.String : '';
                    break;
                case 'source':
                    aVal = a.Source.Valid ? a.Source.String : '';
                    bVal = b.Source.Valid ? b.Source.String : '';
                    break;
                case 'created':
                    aVal = a.CreatedAt.Valid ? new Date(a.CreatedAt.Time).getTime() : 0;
                    bVal = b.CreatedAt.Valid ? new Date(b.CreatedAt.Time).getTime() : 0;
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [contacts, searchTerm, sortField, sortDirection]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new':
                return 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
            case 'active':
                return 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400';
            case 'qualified':
                return 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400';
            case 'negotiating':
                return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'closed':
                return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400';
            default:
                return 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return (
            <svg
                className={`ml-2 inline h-4 w-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Search Bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <Input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {filteredAndSortedContacts.length} contacts
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                className="cursor-pointer select-none"
                                onClick={() => handleSort('name')}
                            >
                                Name <SortIcon field="name" />
                            </TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead
                                className="cursor-pointer select-none"
                                onClick={() => handleSort('status')}
                            >
                                Status <SortIcon field="status" />
                            </TableHead>
                            <TableHead
                                className="cursor-pointer select-none"
                                onClick={() => handleSort('source')}
                            >
                                Source <SortIcon field="source" />
                            </TableHead>
                            <TableHead>Price Range</TableHead>
                            <TableHead
                                className="cursor-pointer select-none"
                                onClick={() => handleSort('created')}
                            >
                                Created <SortIcon field="created" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedContacts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No contacts found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAndSortedContacts.map((contact) => (
                                <TableRow
                                    key={contact.ID}
                                    className="cursor-pointer"
                                    onClick={() => router.push(`/people/${contact.ID}`)}
                                >
                                    <TableCell className="font-medium">
                                        {contact.FirstName} {contact.LastName}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                                            {contact.City.Valid && contact.City.String && (
                                                <span>
                                                    {contact.City.String}
                                                    {contact.State.Valid && `, ${contact.State.String}`}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {contact.Status.Valid && (
                                            <Badge variant="secondary" className={getStatusColor(contact.Status.String)}>
                                                {contact.Status.String}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {contact.Source.Valid ? contact.Source.String : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {contact.PriceRange.Valid ? contact.PriceRange.String : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {contact.CreatedAt.Valid ? formatDate(contact.CreatedAt.Time) : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

