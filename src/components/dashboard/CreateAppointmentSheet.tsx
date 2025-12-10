"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import type { Contact } from "@/lib/definitions/backend/contacts";
import {
    CreateAppointment,
    SearchContacts,
} from "@/lib/data/backend/clientCalls";

export default function CreateAppointmentModal({ ownerId }: { ownerId: string }) {
    const [open, setOpen] = useState(false);

    // Form state
    const [contactSearch, setContactSearch] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<string>("");

    const [title, setTitle] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [notes, setNotes] = useState("");
    const [outcome, setOutcome] = useState("no-outcome");
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");

    // 🔍 Debounced contact search
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
            await CreateAppointment(
                selectedContact,
                title,
                scheduledAt,
                notes,
                outcome,
                location,
                type
            );
            toast.success("Appointment scheduled!");
            setOpen(false);
        } catch {
            toast.error("Failed to schedule appointment.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger button (unchanged) */}
            <DialogTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
                    <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                        <svg
                            className="h-5 w-5 text-green-600 dark:text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                            Schedule Appointment
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">
                            Book a showing
                        </p>
                    </div>
                </button>
            </DialogTrigger>

            {/* MODAL CONTENT */}
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Schedule Appointment</DialogTitle>
                    <DialogDescription>
                        Fill out the appointment details below.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                    {/* CONTACT SEARCH */}
                    <div className="space-y-2">
                        <Label>Select Contact</Label>

                        <Input
                            placeholder="Search contacts..."
                            value={contactSearch}
                            onChange={(e) => setContactSearch(e.target.value)}
                        />

                        {(contacts ?? []).length > 0 && (
                            <div className="rounded-md border p-2 bg-white dark:bg-zinc-900 max-h-40 overflow-y-auto">
                                {(contacts ?? []).map((c) => (
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

                    {/* DATE/TIME */}
                    <div>
                        <Label>Scheduled At</Label>
                        <Input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                        />
                    </div>

                    {/* TYPE */}
                    <div>
                        <Label>Type</Label>
                        <Input value={type} onChange={(e) => setType(e.target.value)} />
                    </div>

                    {/* LOCATION */}
                    <div>
                        <Label>Location</Label>
                        <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    {/* OUTCOME */}
                    <div>
                        <Label>Outcome</Label>
                        <Input value={outcome} onChange={(e) => setOutcome(e.target.value)} />
                    </div>

                    {/* NOTES */}
                    <div>
                        <Label>Notes</Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button onClick={handleCreate}>Schedule</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
