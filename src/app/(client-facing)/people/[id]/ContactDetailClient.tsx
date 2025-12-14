'use client';

import { ContactWithDetails } from '@/lib/definitions/backend/contacts';
import { ContactNote } from '@/lib/definitions/backend/notes';
import { ContactLog } from '@/lib/definitions/backend/contactLogs';
import { Email } from '@/lib/definitions/backend/emails';
import { PhoneNumber } from '@/lib/definitions/backend/phoneNumbers';
import { Deal } from '@/lib/definitions/backend/deals';
import { Appointment } from '@/lib/definitions/backend/appointments';
import { Task } from '@/lib/definitions/backend/tasks';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CreateContactLog, CreateContactNote } from '@/lib/data/backend/clientCalls';
import Sidebar from '@/components/people/id/sidebar';
import { formatDate } from '@/lib/utils/formating';
import RightSidebar from '@/components/people/id/rightSidebar';
import { Tag } from '@/lib/definitions/backend/tag';
import { Stage } from '@/lib/definitions/backend/stage';
import { useRouter } from 'next/navigation';


interface ContactDetailClientProps {
    contact: ContactWithDetails;
    notes: ContactNote[];
    logs: ContactLog[];
    emails: Email[];
    phoneNumbers: PhoneNumber[];
    tags: Tag[];
    allTags: Tag[];
    deals: Deal[];
    appointments: Appointment[];
    tasks: Task[];
    stages: Stage[];
}

export default function ContactDetailClient(props: ContactDetailClientProps) {
    const { contact, notes: initialNotes, logs: initialLogs, emails, phoneNumbers, tags: initialTags, allTags, stages } = props;
    const [notes, setNotes] = useState(initialNotes);
    const [logs, setLogs] = useState(initialLogs);
    const [newNote, setNewNote] = useState('');
    const [newLog, setNewLog] = useState({ method: 'Call', note: '' });
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [isAddingLog, setIsAddingLog] = useState(false);

    const router = useRouter();


    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setIsAddingNote(true);
        try {
            const note = await CreateContactNote(contact.ID, newNote);
            setNotes([note, ...notes]);
            setNewNote('');
            toast.success('Note added successfully');
            router.refresh();
        } catch (error) {
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
            router.refresh();
        } catch (error) {
            toast.error('Failed to add contact log');
        } finally {
            setIsAddingLog(false);
        }
    };


    return (
        <div className="flex h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950">
            {/* Left Sidebar - Contact Info */}
            <Sidebar
                contact={contact}
                emails={emails}
                phoneNumbers={phoneNumbers}
                tags={initialTags}
                allTags={allTags}
            />

            {/* Main Content - Notes & Logs */}
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-4xl p-6">
                    <Tabs defaultValue="notes" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
                            <TabsTrigger value="logs">Contact Logs ({logs.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="notes" className="mt-6">
                            <div className="space-y-4">
                                <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-950/20">
                                    <h3 className="mb-3 font-semibold text-yellow-900 dark:text-yellow-200">Add Note</h3>
                                    <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Write a note..." className="mb-3" rows={3} />
                                    <Button onClick={handleAddNote} disabled={isAddingNote || !newNote.trim()} className="bg-yellow-600 hover:bg-yellow-700">
                                        {isAddingNote ? 'Adding...' : 'Add Note'}
                                    </Button>
                                </div>

                                {notes.length === 0 ? (
                                    <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No notes yet</h3>
                                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Add your first note above</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {notes.map(note => (
                                            <div key={note.ID} className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:border-yellow-600 dark:bg-yellow-950/20">
                                                <p className="text-sm text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">{note.Note}</p>
                                                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{note.CreatedAt.Valid && formatDate(note.CreatedAt.Time)}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="logs" className="mt-6">
                            <div className="space-y-4">
                                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
                                    <h3 className="mb-3 font-semibold text-green-900 dark:text-green-200">Add Contact Log</h3>
                                    <select value={newLog.method} onChange={(e) => setNewLog({ ...newLog, method: e.target.value })} className="mb-3 w-full rounded-lg border p-2 text-sm">
                                        <option value="Call">Call</option>
                                        <option value="Email">Email</option>
                                        <option value="Text">Text</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <Textarea value={newLog.note} onChange={(e) => setNewLog({ ...newLog, note: e.target.value })} placeholder="What was discussed?" className="mb-3" rows={3} />
                                    <Button onClick={handleAddLog} disabled={isAddingLog || !newLog.note.trim()} className="bg-green-600 hover:bg-green-700">
                                        {isAddingLog ? 'Adding...' : 'Add Log'}
                                    </Button>
                                </div>

                                {logs.length === 0 ? (
                                    <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No contact logs yet</h3>
                                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Log your first interaction above</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {logs.map(log => (
                                            <div key={log.ID} className="rounded-lg border-l-4 border-green-400 bg-green-50 p-4 dark:border-green-600 dark:bg-green-950/20">
                                                <Badge className="mb-2">{log.ContactMethod}</Badge>
                                                {log.Note.Valid && <p className="text-sm text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">{log.Note.String}</p>}
                                                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{log.CreatedAt.Valid && formatDate(log.CreatedAt.Time)}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Right Sidebar - Tasks, Appointments, Deals */}
            <RightSidebar
                deals={props.deals}
                appointments={props.appointments}
                tasks={props.tasks}
                stages={stages}
            />
        </div>
    );
}
