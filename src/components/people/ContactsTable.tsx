'use client';

import { Contact } from '@/lib/definitions/backend/contacts';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatPhoneNumber } from '@/lib/utils/formating';
import { ContactsPagination } from './pagination';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useContactsNav } from '@/lib/hooks/UseContactsNav';

interface ContactsTableProps {
    contacts: Contact[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onDeleteContacts?: (contactIds: string[]) => Promise<void>;
}

type SortField = 'name' | 'status' | 'source' | 'created';
type SortDirection = 'asc' | 'desc';


export default function ContactsTableNew({ contacts, onDeleteContacts, totalPages, onPageChange, currentPage }: ContactsTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('created');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Pagination state from Zustand
    const setLimit = useContactsNav((state) => state.setLimit);
    const setOffset = useContactsNav((state) => state.setOffset);
    const setCurrentIndex = useContactsNav((state) => state.setCurrentIndex);
    const stateContacts = useContactsNav((state) => state.contactIds);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    const LIMIT_OPTIONS = ['10', '25', '50', '100']

    const limit = useContactsNav((state) => state.limit);

    const currentLimit = searchParams.get('limit') ?? limit.toString();

    const handleLimitChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set('limit', value)
        params.set('offset', '0') // reset pagination when limit changes
        setLimit(Number(value))
        setOffset(0)

        router.push(`${pathname}?${params.toString()}`)
    }


    /** SELECTION */
    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const allSelectedOnPage =
        contacts.length > 0 &&
        contacts.every((c) => selectedIds.has(c.ID));

    const toggleSelectAllOnPage = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allSelectedOnPage) {
                contacts.forEach((c) => next.delete(c.ID));
            } else {
                contacts.forEach((c) => next.add(c.ID));
            }
            return next;
        });
    };

    /** DELETE FUNCTIONALITY */
    const handleDeleteClick = () => {
        if (selectedIds.size > 0) {
            setShowDeleteDialog(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (!onDeleteContacts || selectedIds.size === 0) return;

        setIsDeleting(true);
        try {
            await onDeleteContacts(Array.from(selectedIds));
            setSelectedIds(new Set()); // Clear selection after successful delete
            setShowDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting contacts:', error);
            // You might want to show an error toast here
        } finally {
            setIsDeleting(false);
        }
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
        <div className="flex flex-col gap-4 w-full h-full max-h-screen">
            {/* SEARCH AND ACTIONS */}
            <div className="flex items-center justify-between gap-4 flex-shrink-0">
                <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                    className="max-w-sm"
                />
                <div className="flex items-center gap-3">
                    {selectedIds.size > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteClick}
                            className="gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete {selectedIds.size} {selectedIds.size === 1 ? 'contact' : 'contacts'}
                        </Button>
                    )}
                    <div className="text-sm text-zinc-500">
                        <div className="text-sm text-zinc-500 flex items-center gap-2">
                            <span>Per page</span>

                            <Select value={currentLimit} onValueChange={handleLimitChange}>
                                <SelectTrigger className="w-[90px]">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    {LIMIT_OPTIONS.map((limit) => (
                                        <SelectItem key={limit} value={limit}>
                                            {limit}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded-lg border flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-zinc-100 dark:bg-zinc-800">
                        <TableRow>
                            <TableHead className="w-10 bg-zinc-50 dark:bg-zinc-900">
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
                        {contacts.map((contact) => {
                            // Compute primary phone once
                            const phoneNumbers = typeof contact.PhoneNumbers === 'string'
                                ? JSON.parse(contact.PhoneNumbers)
                                : contact.PhoneNumbers;
                            const primaryPhone =
                                Array.isArray(phoneNumbers)
                                    ? phoneNumbers.find((pn: any) => pn.is_primary)?.phone_number ?? 'N/A'
                                    : 'N/A';
                            return (
                                <TableRow
                                    key={contact.ID}
                                    className="cursor-pointer bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                                    onClick={() => {
                                        setCurrentIndex(Math.max(0, stateContacts.findIndex((stateContact) => stateContact.id === contact.ID)))
                                        router.push(`/people/${contact.ID}`)
                                    }}
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
            <div className="flex-shrink-0">
                <ContactsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>

            {/* DELETE CONFIRMATION DIALOG */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Contacts</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedIds.size} {selectedIds.size === 1 ? 'contact' : 'contacts'}?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
