// CreateTaskForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Contact } from "@/lib/definitions/backend/contacts";
import { SearchContacts, CreateTask } from "@/lib/data/backend/clientCalls";
import { CombineDateTime } from "@/lib/utils/formating";
import { useRouter } from "next/navigation";


export default function CreateTaskForm() {
    const [contactSearch, setContactSearch] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState("");

    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [note, setNote] = useState("");
    const router = useRouter();

    // Debounce contact search
    const handleSearch = (value: string) => {
        setContactSearch(value);
        if (value.trim().length < 2) {
            setContacts([]);
            return;
        }
        const delay = setTimeout(async () => {
            try {
                const results = await SearchContacts(value);
                setContacts(results);
            } catch {
                toast.error("Error searching contacts.");
            }
        }, 300);
        return () => clearTimeout(delay);
    };

    const handleCreate = async () => {
        if (!selectedContact) return toast.error("Please select a contact");

        const scheduledAt = CombineDateTime(scheduledDate, scheduledTime);

        try {
            await CreateTask(selectedContact, title, type, scheduledAt, status, priority, note);
            toast.success("Task created!");
            router.refresh();
        } catch {
            toast.error("Failed to create task.");
        }
    };

    const taskType = [
        { label: "Call", value: "call" },
        { label: "Email", value: "email" },
        { label: "Follow Up", value: "follow-up" },
        { label: "Text", value: "text" },
        { label: "Showing", value: "showing" },
        { label: "Closing", value: "closing" },
        { label: "Open House", value: "open-house" },
        { label: "Thank You", value: "thank-you" },
        { label: "Other", value: "other" },
    ]

    const taskStatus = [
        { label: "Pending", value: "pending" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
    ]

    const taskPriority = [
        { label: "Low", value: "low" },
        { label: "Normal", value: "normal" },
        { label: "High", value: "high" },
    ]

    return (
        <div className="mt-6 space-y-6">
            {/* CONTACT SEARCH */}
            <div className="space-y-2">
                <Label>Select Contact</Label>
                <Input
                    placeholder="Search contacts..."
                    value={contactSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                />

                {contacts.length > 0 && (
                    <div className="rounded-md border p-2 bg-white dark:bg-zinc-900 max-h-40 overflow-y-auto">
                        {contacts.map((c) => (
                            <button
                                key={c.ID}
                                className={`block w-full text-left p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 ${selectedContact === c.ID ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
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
                <Input className="mt-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            {/* TYPE */}
            <div>
                <Label>Type</Label>
                <select className="border rounded p-2 w-full mt-2" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Select type...</option>
                    {taskType.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </div>

            {/* DATE */}
            <div>
                <Label>Date</Label>
                <Input type="date" className="mt-2" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
            </div>

            {/* TIME */}
            <div>
                <Label>Time</Label>
                <Input type="time" className="mt-2" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
            </div>

            {/* STATUS */}
            <div>
                <Label>Status</Label>
                <select className="border rounded p-2 w-full mt-2" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Select Status...</option>
                    {taskStatus.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </div>

            {/* PRIORITY */}
            <div>
                <Label>Priority</Label>
                <select className="border rounded p-2 w-full mt-2" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="">Select Priority...</option>
                    {taskPriority.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </div>

            {/* NOTE */}
            <div>
                <Label>Note</Label>
                <Textarea className="mt-2" rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            {/* SUBMIT */}
            <div className="pt-4">
                <Button onClick={handleCreate}>Create Task</Button>
            </div>
        </div>
    );
}
