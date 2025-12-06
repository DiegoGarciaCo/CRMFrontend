'use client';

import { ContactWithDetails } from '@/lib/definitions/backend/contacts';
import { ContactNote } from '@/lib/definitions/backend/notes';
import { ContactLog } from '@/lib/definitions/backend/contactLogs';
import { Email } from '@/lib/definitions/backend/emails';
import { PhoneNumber } from '@/lib/definitions/backend/phoneNumbers';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AddTagToContact, CreateContactLog, CreateContactNote, RemoveTagFromContact } from '@/lib/data/backend/clientCalls';
import { NullString, NullTime, NullUUID } from '@/lib/definitions/nullTypes';

interface TagLowercase {
    id: string;
    name: string;
    ID: string;
    Name: string;
    Description: NullString;
    UserID: NullUUID;
    TeamID: NullUUID;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
}

interface ContactDetailClientProps {
    contact: ContactWithDetails;
    notes: ContactNote[];
    logs: ContactLog[];
    emails: Email[];
    phoneNumbers: PhoneNumber[];
    tags: TagLowercase[];
    allTags: TagLowercase[];
    userId: string;
}

export default function ContactDetailClient({
    contact,
    notes: initialNotes,
    logs: initialLogs,
    emails,
    phoneNumbers,
    tags: initialTags,
    allTags,
    userId,
}: ContactDetailClientProps) {
    const router = useRouter();
    const [notes, setNotes] = useState(initialNotes);
    const [logs, setLogs] = useState(initialLogs);
    const [newNote, setNewNote] = useState('');
    const [newLog, setNewLog] = useState({ method: 'Call', note: '' });
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [isAddingLog, setIsAddingLog] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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
            case 'closed':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            default:
                return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        setIsAddingNote(true);
        try {
            const note = await CreateContactNote(contact.ID, newNote);
            setNotes([note, ...notes]);
            setNewNote('');
            toast.success('Note added successfully');
        } catch (error) {
            console.error('Failed to add note:', error);
            toast.error('Failed to add note');
        } finally {
            setIsAddingNote(false);
        }
    };

    const handleAddLog = async () => {
        if (!newLog.note.trim()) return;

        setIsAddingLog(true);
        try {
            const log = await CreateContactLog(contact.ID, newLog.method, newLog.note);
            setLogs([log, ...logs]);
            setNewLog({ method: 'Call', note: '' });
            toast.success('Contact log added successfully');
        } catch (error) {
            console.error('Failed to add log:', error);
            toast.error('Failed to add contact log');
        } finally {
            setIsAddingLog(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950">
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="p-6">
                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/people')}
                        className="mb-6 flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to People
                    </button>

                    {/* Contact Header */}
                    <div className="mb-6">
                        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            {contact.FirstName[0]}
                            {contact.LastName[0]}
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                            {contact.FirstName} {contact.LastName}
                        </h1>
                        {contact.Status.Valid && (
                            <Badge className={`mt-2 ${getStatusColor(contact.Status.String)}`}>
                                {contact.Status.String}
                            </Badge>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6 grid grid-cols-3 gap-2">
                        <button className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 p-3 text-xs font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call
                        </button>
                        <button className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 p-3 text-xs font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email
                        </button>
                        <button className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 p-3 text-xs font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Schedule
                        </button>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                                Contact Information
                            </h3>
                            <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                                {/* Emails */}
                                {(emails ?? []).length > 0 && (
                                    <div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-500">Email{emails.length > 1 ? 's' : ''}</div>
                                        <div className="mt-1 space-y-1">
                                            {Array.isArray(emails) && emails.map((email) => (
                                                <div key={email.id} className="flex items-center gap-2">
                                                    <a
                                                        href={`mailto:${email.email_address}`}
                                                        className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        {email.email_address}
                                                    </a>
                                                    {email.type && email.type && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {email.type}
                                                        </Badge>
                                                    )}
                                                    {email.is_primary && email.is_primary && (
                                                        <Badge variant="secondary" className="bg-blue-100 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                            Primary
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Phone Numbers */}
                                {(phoneNumbers ?? []).length > 0 && (
                                    <div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-500">Phone{phoneNumbers.length > 1 ? 's' : ''}</div>
                                        <div className="mt-1 space-y-1">
                                            {Array.isArray(phoneNumbers) && phoneNumbers.map((phone) => (
                                                <div key={phone.id} className="flex items-center gap-2">
                                                    <a
                                                        href={`tel:${phone.phone_number}`}
                                                        className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        {phone.phone_number}
                                                    </a>
                                                    {phone.type && phone.type && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {phone.type}
                                                        </Badge>
                                                    )}
                                                    {phone.is_primary && phone.is_primary && (
                                                        <Badge variant="secondary" className="bg-blue-100 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                            Primary
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {contact.Address.Valid && contact.Address.String && (
                                    <div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-500">Address</div>
                                        <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {contact.Address.String}
                                            <br />
                                            {contact.City.Valid && contact.City.String}, {contact.State.Valid && contact.State.String}{' '}
                                            {contact.ZipCode.Valid && contact.ZipCode.String}
                                        </div>
                                    </div>
                                )}
                                {contact.Birthdate.Valid && contact.Birthdate.Time && (
                                    <div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-500">Birthdate</div>
                                        <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {formatDate(contact.Birthdate.Time)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                                Property Preferences
                            </h3>
                            <div className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                                {contact.PriceRange.Valid && (
                                    <div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-500">Price Range</div>
                                        <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {contact.PriceRange.String}
                                        </div>
                                    </div>
                                )}
                                {contact.Timeframe.Valid && (
                                    <div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-500">Timeframe</div>
                                        <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {contact.Timeframe.String}
                                        </div>
                                    </div>
                                )}
                                {contact.Lender.Valid && (
                                    <div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-500">Lender</div>
                                        <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {contact.Lender.String}
                                        </div>
                                    </div>
                                )}
                                {contact.Source.Valid && (
                                    <div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-500">Source</div>
                                        <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {contact.Source.String}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                                Timeline
                            </h3>
                            <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                                {contact.CreatedAt.Valid && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-zinc-500 dark:text-zinc-500">Created</span>
                                        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                                            {formatDate(contact.CreatedAt.Time)}
                                        </span>
                                    </div>
                                )}
                                {contact.LastContactedAt.Valid && contact.LastContactedAt.Time && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-zinc-500 dark:text-zinc-500">Last Contacted</span>
                                        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                                            {formatDate(contact.LastContactedAt.Time)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags Section */}
                        <TagsSection
                            contactId={contact.ID}
                            contactTags={allTags}
                            availableTags={initialTags}
                            userId={userId}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-4xl p-6">
                    <Tabs defaultValue="notes" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
                            <TabsTrigger value="logs">Contact Logs ({logs.length})</TabsTrigger>
                        </TabsList>

                        {/* Notes Tab */}
                        <TabsContent value="notes" className="mt-6">
                            <div className="space-y-4">
                                {/* Add Note */}
                                <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-950/20">
                                    <h3 className="mb-3 font-semibold text-yellow-900 dark:text-yellow-200">Add Note</h3>
                                    <Textarea
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Write a note..."
                                        className="mb-3 border-yellow-300 bg-white focus:border-yellow-500 dark:border-yellow-800 dark:bg-zinc-900"
                                        rows={3}
                                    />
                                    <Button
                                        onClick={handleAddNote}
                                        disabled={isAddingNote || !newNote.trim()}
                                        className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800"
                                    >
                                        {isAddingNote ? 'Adding...' : 'Add Note'}
                                    </Button>
                                </div>

                                {/* Notes List */}
                                {notes.length === 0 ? (
                                    <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                                        <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">No notes yet</h3>
                                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                            Add your first note above
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {notes.map((note) => (
                                            <div
                                                key={note.ID}
                                                className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 shadow-sm dark:border-yellow-600 dark:bg-yellow-950/20"
                                            >
                                                <p className="whitespace-pre-wrap text-sm text-zinc-900 dark:text-zinc-100">
                                                    {note.Note}
                                                </p>
                                                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                                                    {note.CreatedAt.Valid && formatDate(note.CreatedAt.Time)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Contact Logs Tab */}
                        <TabsContent value="logs" className="mt-6">
                            <div className="space-y-4">
                                {/* Add Log */}
                                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
                                    <h3 className="mb-3 font-semibold text-green-900 dark:text-green-200">Add Contact Log</h3>
                                    <div className="mb-3">
                                        <label className="mb-2 block text-sm font-medium text-green-900 dark:text-green-200">
                                            Contact Method
                                        </label>
                                        <select
                                            value={newLog.method}
                                            onChange={(e) => setNewLog({ ...newLog, method: e.target.value })}
                                            className="w-full rounded-lg border border-green-300 bg-white p-2 text-sm dark:border-green-800 dark:bg-zinc-900"
                                        >
                                            <option value="Call">Call</option>
                                            <option value="Email">Email</option>
                                            <option value="Text">Text</option>
                                            <option value="Meeting">Meeting</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <Textarea
                                        value={newLog.note}
                                        onChange={(e) => setNewLog({ ...newLog, note: e.target.value })}
                                        placeholder="What was discussed?"
                                        className="mb-3 border-green-300 bg-white focus:border-green-500 dark:border-green-800 dark:bg-zinc-900"
                                        rows={3}
                                    />
                                    <Button
                                        onClick={handleAddLog}
                                        disabled={isAddingLog || !newLog.note.trim()}
                                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                                    >
                                        {isAddingLog ? 'Adding...' : 'Add Log'}
                                    </Button>
                                </div>

                                {/* Logs List */}
                                {logs.length === 0 ? (
                                    <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                                        <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">No contact logs yet</h3>
                                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                            Log your first interaction above
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {logs.map((log) => (
                                            <div
                                                key={log.ID}
                                                className="rounded-lg border-l-4 border-green-400 bg-green-50 p-4 shadow-sm dark:border-green-600 dark:bg-green-950/20"
                                            >
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Badge variant="secondary" className="bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                                        {log.ContactMethod}
                                                    </Badge>
                                                </div>
                                                {log.Note.Valid && log.Note.String && (
                                                    <p className="whitespace-pre-wrap text-sm text-zinc-900 dark:text-zinc-100">
                                                        {log.Note.String}
                                                    </p>
                                                )}
                                                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                                                    {log.CreatedAt.Valid && formatDate(log.CreatedAt.Time)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}


// Tags Section Component
interface TagsSectionProps {
    contactId: string;
    contactTags: TagLowercase[];
    availableTags: TagLowercase[];
    userId: string;
}

function TagsSection({ contactId, contactTags, availableTags }: TagsSectionProps) {
    const router = useRouter();
    const [tags, setTags] = useState<TagLowercase[]>(contactTags);
    const [selectedTagId, setSelectedTagId] = useState<string>('');
    const [isAddingTag, setIsAddingTag] = useState(false);

    const handleAddTag = async () => {
        if (!selectedTagId) return;

        setIsAddingTag(true);
        try {
            await AddTagToContact(contactId, selectedTagId);

            // Find the tag that was added
            const addedTag = availableTags.find(t => t.id === selectedTagId);
            if (addedTag) {
                setTags([...tags, addedTag]);
            }

            setSelectedTagId('');
            toast.success('Tag added successfully');
            router.refresh();
        } catch (error) {
            console.error('Failed to add tag:', error);
            toast.error('Failed to add tag');
        } finally {
            setIsAddingTag(false);
        }
    };

    const handleRemoveTag = async (tagId: string) => {
        try {
            await RemoveTagFromContact(contactId, tagId);
            setTags(tags.filter(t => t.id !== tagId));
            toast.success('Tag removed successfully');
            router.refresh();
        } catch (error) {
            console.error('Failed to remove tag:', error);
            toast.error('Failed to remove tag');
        }
    };

    // Filter out tags that are already assigned to the contact
    const availableTagsToAdd = availableTags.filter(
        availableTag => !tags.some(tag => tag.id === availableTag.id)
    );

    return (
        <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Tags
            </h3>
            <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                {/* Current Tags */}
                {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant="secondary"
                                className="group flex items-center gap-1 bg-purple-100 pr-1 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
                            >
                                <span>{tag.name}</span>
                                <button
                                    onClick={() => handleRemoveTag(tag.id)}
                                    className="ml-1 rounded-full p-0.5 hover:bg-purple-300 dark:hover:bg-purple-800"
                                    title="Remove tag"
                                >
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">No tags assigned</p>
                )}

                {/* Add Tag */}
                {availableTagsToAdd.length > 0 && (
                    <div className="space-y-2 border-t border-zinc-200 pt-3 dark:border-zinc-700">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            Add Tag
                        </label>
                        <div className="flex gap-2">
                            <Select
                                value={selectedTagId}
                                onValueChange={setSelectedTagId}
                            >
                                <SelectTrigger className="flex-1 text-xs">
                                    <SelectValue placeholder="Select a tag..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTagsToAdd.map((tag) => (
                                        <SelectItem key={tag.ID} value={tag.ID}>
                                            {tag.Name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                size="sm"
                                onClick={handleAddTag}
                                disabled={isAddingTag || !selectedTagId}
                                className="flex-shrink-0"
                            >
                                {isAddingTag ? 'Adding...' : 'Add'}
                            </Button>
                        </div>
                    </div>
                )}

                {availableTagsToAdd.length === 0 && tags.length > 0 && (
                    <p className="border-t border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-500">
                        All available tags have been assigned
                    </p>
                )}
            </div>
        </div>
    );
}
