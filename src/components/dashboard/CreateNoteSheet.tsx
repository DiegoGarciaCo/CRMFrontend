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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { SearchContacts } from "@/lib/data/backend/contacts";
import type { Contact } from "@/lib/definitions/backend/contacts";
import { CreateContactNote } from "@/lib/data/backend/notes";
import { CreateContactLog } from "@/lib/data/backend/contactLogs";

interface CreateNoteSheetProps {
    ownerId: string; // for contact search
    userId: string; // created_by
}

export default function CreateNoteSheet({ ownerId, userId }: CreateNoteSheetProps) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<"note" | "log">("note");

    // Contact search state
    const [contactSearch, setContactSearch] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<string>("");

    // Form state
    const [note, setNote] = useState("");
    const [contactMethod, setContactMethod] = useState("");

    // Contact search effect
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (contactSearch.trim().length > 1) {
                try {
                    const results = await SearchContacts(ownerId, contactSearch);
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

    const handleSubmit = async () => {
        if (!selectedContact) return toast.error("Please select a contact");
        try {
            if (tab === "note") {
                await CreateContactNote(selectedContact, note, userId);
                toast.success("Note created!");
            } else {
                if (!contactMethod) return toast.error("Please enter contact method");
                await CreateContactLog(selectedContact, contactMethod, userId, note);
                toast.success("Contact log created!");
            }
            setOpen(false);
            setNote("");
            setContactMethod("");
            setSelectedContact("");
            setContactSearch("");
        } catch {
            toast.error("Failed to create entry.");
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* Trigger button */}
            <SheetTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
                    <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                        <svg
                            className="h-5 w-5 text-yellow-600 dark:text-yellow-400"
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
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">Add Note</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">Create note or log</p>
                    </div>
                </button>
            </SheetTrigger>

            <SheetContent className="overflow-y-auto sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Add Note / Log</SheetTitle>
                    <SheetDescription>Select type and enter details below.</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Contact search */}
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
                                        className={`block w-full text-left p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 ${selectedContact === c.ID ? "bg-zinc-100 dark:bg-zinc-800" : ""
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

                    {/* Tabs */}
                    <Tabs value={tab} onValueChange={(v) => setTab(v as "note" | "log")}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="note">Note</TabsTrigger>
                            <TabsTrigger value="log">Contact Log</TabsTrigger>
                        </TabsList>

                        {/* Note tab */}
                        <TabsContent value="note">
                            <div>
                                <Label>Note</Label>
                                <Textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </TabsContent>

                        {/* Contact log tab */}
                        <TabsContent value="log" className="space-y-4">
                            <div>
                                <Label>Contact Method</Label>
                                <Input
                                    placeholder="Call, Email, etc."
                                    value={contactMethod}
                                    onChange={(e) => setContactMethod(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Note</Label>
                                <Textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <SheetFooter className="mt-6">
                    <Button onClick={handleSubmit}>Save</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
