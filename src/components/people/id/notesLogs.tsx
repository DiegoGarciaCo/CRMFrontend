"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CreateContactLog, CreateContactNote, CreateNotification, GetAllContacts } from "@/lib/data/backend/clientCalls";
import { ContactLog } from "@/lib/definitions/backend/contactLogs";
import { ContactWithDetails } from "@/lib/definitions/backend/contacts";
import { ContactNote } from "@/lib/definitions/backend/notes";
import { formatDate } from "@/lib/utils/formating";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Document from '@tiptap/extension-document'
import Mention from '@tiptap/extension-mention'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import { Placeholder } from '@tiptap/extensions'
import { MentionData } from "@/lib/definitions/backend/mentions";
import { createSuggestion } from "./suggestion";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useContactsNav } from "@/lib/hooks/UseContactsNav";


interface logNoteCreationProps {
    contact: ContactWithDetails;
    notes: ContactNote[];
    logs: ContactLog[];
}

function NoteDisplay({ content }: { content: string }) {
    const editor = useEditor({
        extensions: [Document, Paragraph, Text, Mention.configure({
            HTMLAttributes: {
                class: 'mention',
            },
            renderText({ node }) {
                return `${node.attrs.label ?? node.attrs.id}`  // Remove the @ char
            },
            renderHTML({ node }) {
                return [
                    'span',
                    { class: 'mention' },
                    node.attrs.label ?? node.attrs.id  // No @ character
                ];
            },
        })],
        content: content,
        editable: false,
        immediatelyRender: false,
    });

    return <EditorContent editor={editor} className="text-sm prose prose-sm dark:prose-invert" />;
}

export const extractMentions = (editor: Editor | null): MentionData[] => {
    if (!editor) return [];

    const mentions: MentionData[] = [];
    editor.state.doc.descendants((node) => {
        if (node.type.name === 'mention') {
            mentions.push({
                id: node.attrs.id,
                label: node.attrs.label
            });
        }
    });
    return mentions;
};


export default function LogNoteCreation(props: logNoteCreationProps) {
    const { contact, notes, logs } = props;
    const [newNote, setNewNote] = useState('');
    const [newLog, setNewLog] = useState({ method: 'Call', note: '' });
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [isAddingLog, setIsAddingLog] = useState(false);
    const { data } = authClient.useListOrganizations()
    const [editor, setEditor] = useState<Editor | null>(null);

    const router = useRouter();

    const orgIDs = useMemo(() => data?.map(org => org.id) ?? [], [data]);

    // contacts from zustand store
    const contacts = useContactsNav((state) => state.contactIds);
    const setContactIds = useContactsNav((state) => state.setContactIds);
    const currentIndex = useContactsNav((state) => state.currentIndex);
    const setCurrentIndex = useContactsNav((state) => state.setCurrentIndex);
    const offset = useContactsNav((state) => state.offset);
    const setOffset = useContactsNav((state) => state.setOffset);
    const limit = useContactsNav((state) => state.limit);
    const totalPages = useContactsNav((state) => state.totalPages);

    // current page
    const o = Number(offset);
    const l = Number(limit) || 20;
    const page = Number.isFinite(o) ? Math.floor(o / l) + 1 : 1;

    useEffect(() => {
        if (orgIDs.length === 0) return;

        // Tiptap editor setup for mentions
        const e = new Editor({
            extensions: [
                Document,
                Paragraph,
                Placeholder.configure({
                    placeholder: 'Write your note here...',
                }),
                Text,
                Mention.configure({
                    HTMLAttributes: {
                        class: 'mention',
                    },
                    suggestion: createSuggestion(orgIDs),
                    renderText({ node }) {
                        return `${node.attrs.label ?? node.attrs.id}`
                    },
                    renderHTML({ node }) {
                        return [
                            'span',
                            { class: 'mention' },
                            node.attrs.label ?? node.attrs.id  // No @ character
                        ];
                    },
                }),
            ],
        });
        setEditor(e);

        return () => {
            e.destroy();
        };
    }, [orgIDs]);

    useEffect(() => {
        if (!editor) return

        const updateHandler = () => {
            setNewNote(editor.getHTML())
        }

        editor.on('update', updateHandler)

        return () => {
            editor.off('update', updateHandler)
        }
    }, [editor])

    const isNoteEmpty = !editor || editor.isEmpty

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setIsAddingNote(true);
        try {
            const mentions = extractMentions(editor);

            await CreateContactNote(contact.ID, newNote);

            if (mentions.length > 0) {
                try {
                    for (const mention of mentions) {
                        await CreateNotification(
                            mention.id,
                            "mention",
                            `You were mentioned in a note for contact ${contact.FirstName} ${contact.LastName}.`,
                            contact.ID
                        );
                    }
                } catch (notificationError) {
                    console.error('Failed to create notifications for mentions:', notificationError);
                }
            }
            toast.success('Note added successfully');
            router.refresh();
        } catch (error) {
            toast.error('Failed to add note');
        } finally {
            setIsAddingNote(false);
            editor?.commands.clearContent();
            setNewNote('');
        }
    };

    const handleAddLog = async () => {
        if (!newLog.note.trim()) return;
        setIsAddingLog(true);
        try {
            await CreateContactLog(contact.ID, newLog.method, newLog.note);
            toast.success('Contact log added successfully');
            router.refresh();
        } catch (error) {
            toast.error('Failed to add contact log');
        } finally {
            setIsAddingLog(false);
            setNewLog({ method: 'Call', note: '' });
        }
    };

    // Helper to fetch next/previous contacts
    const fetchNextContacts = async () => {
        const stringLimit = limit.toString();
        const stringOffset = (offset + limit).toString();
        const res = await GetAllContacts(stringLimit, stringOffset);
        return res
    };

    const fetchPreviousContacts = async () => {
        const stringLimit = limit.toString();
        const stringOffset = Math.max(0, offset - limit).toString();
        const res = await GetAllContacts(stringLimit, stringOffset);

        return res
    }


    const handleNextContact = async () => {
        // Check if we are at the end of the current contacts list
        if (currentIndex === contacts.length - 1) {
            // Check if there are more contacts to load
            if (page < totalPages) {
                // fetch next page of contacts from backend
                const newContacts = await fetchNextContacts();
                setContactIds(newContacts.map((contact, i) => ({ index: i, id: contact.ID })));
                setOffset(offset + limit);
                setCurrentIndex(0);
                // Navigate to the first contact of the new page
                router.push(`/people/${newContacts[0].ID}`);
            }
            return; // Do nothing if at the end and no more contacts to load
        }
        // Logic to navigate to the next contact
        setCurrentIndex(currentIndex + 1);
        router.push(`/people/${contacts[currentIndex + 1].id}`);
    }

    const handlePreviousContact = async () => {
        // Check if we are at the start of the current contacts list
        if (currentIndex === 0) {
            // Check if there are previous contacts to load
            if (page > 1) {
                // fetch previous page of contacts from backend
                const newContacts = await fetchPreviousContacts();
                setContactIds(newContacts.map((contact, i) => ({ index: i, id: contact.ID })));
                setOffset(Math.max(0, offset - limit));
                setCurrentIndex(newContacts.length - 1);
                // Navigate to the last contact of the new page
                router.push(`/people/${newContacts[newContacts.length - 1].ID}`);
            }
            return; // Do nothing if at the start and no previous contacts to load
        }
        // Logic to navigate to the previous contact
        setCurrentIndex(currentIndex - 1);
        router.push(`/people/${contacts[currentIndex - 1].id}`);
    }

    return (

        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl p-6 pt-4">
                <div className="flex justify-between items-center text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    <button
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded ${currentIndex === 0 && offset === 0
                            ? "opacity-50 cursor-not-allowed" // visually disabled
                            : "cursor-pointer hover:text-zinc-950"
                            }`}
                        onClick={handlePreviousContact}
                        disabled={currentIndex === 0 && offset === 0}
                    >
                        <ArrowLeft className="inline" /> Back
                    </button>
                    <button className={`inline-flex items-center gap-1 px-2 py-1 rounded ${currentIndex >= contacts.length - 1 && page >= totalPages
                        ? "opacity-50 cursor-not-allowed" // visually disabled
                        : "cursor-pointer hover:text-zinc-950"
                        }`} onClick={handleNextContact} disabled={currentIndex >= contacts.length - 1 && page == totalPages} >Next <ArrowRight className="inline" /></button>
                </div>
                <Tabs defaultValue="notes" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
                        <TabsTrigger value="logs">Contact Logs ({logs.length})</TabsTrigger>
                    </TabsList>


                    <TabsContent value="notes" className="mt-6">
                        <div className="space-y-4">
                            <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-950/20">
                                <h3 className="mb-3 font-semibold text-yellow-900 dark:text-yellow-200">Add Note</h3>
                                <EditorContent
                                    editor={editor}
                                    onChange={() => {
                                        if (editor) {
                                            setNewNote(editor.getHTML());
                                        }
                                    }}
                                    className="mb-3 border p-2 rounded-lg min-h-[100px]"
                                />

                                <Button onClick={handleAddNote} disabled={isAddingNote || isNoteEmpty} className="bg-yellow-600 hover:bg-yellow-700">
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
                                            <NoteDisplay content={note.Note} />
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
    )
}

