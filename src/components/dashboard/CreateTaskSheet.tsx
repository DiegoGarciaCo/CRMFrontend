"use client";

import { useState, useEffect } from "react";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import type { Contact } from "@/lib/definitions/backend/contacts";
import { CreateTask, SearchContacts } from "@/lib/data/backend/clientCalls";

interface CreateTaskSheetProps {
    ownerId: string; // for contact search
}

export default function CreateTaskSheet({ ownerId }: CreateTaskSheetProps) {
    const [open, setOpen] = useState(false);

    // Form state
    const [contactSearch, setContactSearch] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<string>("");

    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [note, setNote] = useState("");

    // Contact search
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (contactSearch.trim().length > 1) {
                try {
                    const results = await SearchContacts(contactSearch);
                    setContacts(results);
                } catch {
                    toast.error("Error searching contacts.");
                }
            } else {
                setContacts([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [contactSearch, ownerId]);

    const handleCreate = async () => {
        if (!selectedContact) return toast.error("Please select a contact");

        try {
            await CreateTask(
                selectedContact,
                title,
                type,
                date,
                status,
                priority,
                note
            );
            toast.success("Task created!");
            setOpen(false);
        } catch {
            toast.error("Failed to create task.");
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* Trigger button */}
            <SheetTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
                    <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                        <svg
                            className="h-5 w-5 text-purple-600 dark:text-purple-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 3v4h14V3H5zM5 7v14h14V7H5z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">Create Task</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">Assign a new task</p>
                    </div>
                </button>
            </SheetTrigger>

            <SheetContent className="overflow-y-auto sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Create Task</SheetTitle>
                    <SheetDescription>Enter task details below.</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">

                    {/* CONTACT SEARCH */}
                    <div className="space-y-2">
                        <Label>Select Contact</Label>
                        <Input
                            placeholder="Search contacts..."
                            value={contactSearch}
                            onChange={(e) => setContactSearch(e.target.value)}
                        />
                        {contacts.length > 0 && (
                            <div className="rounded-md border p-2 bg-white dark:bg-zinc-900 max-h-40 overflow-y-auto">
                                {contacts.map((c) => (
                                    <button
                                        key={c.ID}
                                        className={`block w-full text-left p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 ${selectedContact === c.ID
                                            ? "bg-zinc-100 dark:bg-zinc-800"
                                            : ""
                                            }`}
                                        onClick={() => {
                                            setSelectedContact(c.ID);
                                            setContactSearch(`${c.FirstName} ${c.LastName}`);
                                            setContacts([]);
                                        }}
                                    >
                                        {c.FirstName} {c.LastName}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* TITLE */}
                    <div>
                        <Label>Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    {/* TYPE */}
                    <div>
                        <Label>Type</Label>
                        <Input value={type} onChange={(e) => setType(e.target.value)} />
                    </div>

                    {/* DATE */}
                    <div>
                        <Label>Date</Label>
                        <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>

                    {/* STATUS */}
                    <div>
                        <Label>Status</Label>
                        <Input value={status} onChange={(e) => setStatus(e.target.value)} />
                    </div>

                    {/* PRIORITY */}
                    <div>
                        <Label>Priority</Label>
                        <Input value={priority} onChange={(e) => setPriority(e.target.value)} />
                    </div>

                    {/* NOTE */}
                    <div>
                        <Label>Note</Label>
                        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} />
                    </div>
                </div>

                <SheetFooter className="mt-6">
                    <Button onClick={handleCreate}>Create Task</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
