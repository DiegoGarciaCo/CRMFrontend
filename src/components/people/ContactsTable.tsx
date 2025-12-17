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
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { formatPhoneNumber } from '@/lib/utils/formating';

interface ContactsTableProps {
    contacts: Contact[];
}

type SortField = 'name' | 'status' | 'source' | 'created';
type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 50;

export default function ContactsTableNew({ contacts }: ContactsTableProps) {
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('created');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    /** FILTER + SORT */
    const filteredAndSortedContacts = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();

        if (!contacts) return [];

        return [...contacts]
            .filter((contact) => {
                const fullName = `${contact.FirstName} ${contact.LastName}`.toLowerCase();
                const status = contact.Status.Valid ? contact.Status.String.toLowerCase() : '';
                const source = contact.Source.Valid ? contact.Source.String.toLowerCase() : '';
                return (
                    fullName.includes(searchLower) ||
                    status.includes(searchLower) ||
                    source.includes(searchLower)
                );
            })
            .sort((a, b) => {
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
                }

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [contacts, searchTerm, sortField, sortDirection]);

    /** PAGINATION */
    const totalPages = contacts ? Math.ceil(filteredAndSortedContacts.length / PAGE_SIZE) : 1;

    const paginatedContacts = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredAndSortedContacts.slice(start, start + PAGE_SIZE);
    }, [filteredAndSortedContacts, currentPage]);

    /** SELECTION */
    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };


    const allSelectedOnPage =
        paginatedContacts.length > 0 &&
        paginatedContacts.every((c) => selectedIds.has(c.ID));

    const toggleSelectAllOnPage = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allSelectedOnPage) {
                paginatedContacts.forEach((c) => next.delete(c.ID));
            } else {
                paginatedContacts.forEach((c) => next.add(c.ID));
            }
            return next;
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new':
                return 'bg-blue-100 text-blue-700';
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'qualified':
                return 'bg-purple-100 text-purple-700';
            default:
                return 'bg-zinc-100 text-zinc-700';
        }
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* SEARCH */}
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="max-w-sm"
                />
                <div className="text-sm text-zinc-500">
                    {selectedIds.size} selected
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">
                                <Checkbox
                                    checked={allSelectedOnPage}
                                    onCheckedChange={toggleSelectAllOnPage}
                                />
                            </TableHead>
                            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                                Name
                            </TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedContacts.map((contact) => {
                            // Compute primary phone once
                            const primaryPhone = JSON.parse(contact.PhoneNumbers as unknown as string).find(
                                (pn: any) => pn.is_primary
                            )?.phone_number || 'N/A';

                            return (
                                <TableRow
                                    key={contact.ID}
                                    className="cursor-pointer"
                                    onClick={() => router.push(`/people/${contact.ID}`)}
                                >
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selectedIds.has(contact.ID)}
                                            onCheckedChange={() => toggleSelect(contact.ID)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium capitalize">
                                        {contact.FirstName} {contact.LastName}
                                    </TableCell>
                                    <TableCell>{formatPhoneNumber(primaryPhone)}</TableCell>
                                    <TableCell className="capitalize">
                                        {contact.Status.Valid && (
                                            <Badge className={getStatusColor(contact.Status.String)}>
                                                {contact.Status.String}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {contact.Source.Valid ? contact.Source.String : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {contact.CreatedAt.Valid
                                            ? formatDate(contact.CreatedAt.Time)
                                            : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                >
                    Previous
                </Button>
                <span className="text-sm text-zinc-500">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
