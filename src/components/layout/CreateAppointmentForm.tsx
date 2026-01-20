"use client";

import { useState, useEffect } from "react";
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
import { CombineDateTime } from "@/lib/utils/formating";
import { useRouter } from "next/navigation";

export function CreateAppointmentForm({ contactId }: { contactId?: string }) {
    // ---- State ----
    const [contactSearch, setContactSearch] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<string>("");

    const [title, setTitle] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [notes, setNotes] = useState("");
    const [outcome, setOutcome] = useState("no-outcome");
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");

    const router = useRouter();

    // Appointment type & outcomes
    const appointmentTypes = [
        { label: "Buyer Consultation", value: "Buyer-appointment" },
        { label: "Listing Appointment", value: "Listing-appointment" },
        { label: "Showing", value: "showing" },
        { label: "Inspection", value: "inspection" },
        { label: "Appraisal", value: "appraisal" },
        { label: "Open House", value: "open-house" },
        { label: "Other", value: "OTHER" }
    ];

    const appointmentOutcomes = [
        { label: "No Outcome", value: "no-outcome" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Rescheduled", value: "rescheduled" },
        { label: "No Show", value: "no-show" },
        { label: "Pending", value: "pending" },
        { label: "Said Yes", value: "yes" },
        { label: "Said No", value: "no" }
    ];

    // 🔍 Debounced search
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
    }, [contactSearch]);

    // ---- Submit ----
    const handleCreate = async () => {
        if (!selectedContact && !contactId) return toast.error("Please select a contact");

        const scheduledAt = CombineDateTime(scheduledDate, scheduledTime);

        try {
            const contact = contactId || selectedContact;
            await CreateAppointment(
                contact,
                title,
                scheduledAt,
                notes,
                outcome,
                location,
                type
            );

            toast.success("Appointment scheduled!");


            // reset local state
            setContactSearch("");
            setContacts([]);
            setSelectedContact("");
            setTitle("");
            setScheduledDate("");
            setScheduledTime("");
            setNotes("");
            setOutcome("no-outcome");
            setLocation("");
            setType("");

            router.refresh();
        } catch {
            toast.error("Failed to schedule appointment.");
        }
    };

    return (
        <div className="space-y-6">

            {!contactId && (
                <div className="space-y-2">
                    {/* CONTACT SEARCH */}
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
            )}

            {/* TITLE */}
            <div>
                <Label>Title</Label>
                <Input
                    className="mt-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* DATE */}
            <div>
                <Label>Date</Label>
                <Input
                    className="mt-2"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                />
            </div>

            {/* TIME */}
            <div>
                <Label>Time</Label>
                <Input
                    className="mt-2"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                />
            </div>

            {/* TYPE */}
            <div>
                <Label>Type</Label>
                <select
                    className="border rounded p-2 w-full mt-2"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="">Select type...</option>
                    {appointmentTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* LOCATION */}
            <div>
                <Label>Location</Label>
                <Input
                    className="mt-2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            {/* OUTCOME */}
            <div>
                <Label>Outcome</Label>
                <select
                    className="border rounded p-2 w-full mt-2"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                >
                    <option value="">Select outcome...</option>
                    {appointmentOutcomes.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* NOTES */}
            <div>
                <Label>Notes</Label>
                <Textarea
                    className="mt-2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                />
            </div>

            {/* SUBMIT */}
            <Button className="w-full" onClick={handleCreate}>
                Schedule Appointment
            </Button>
        </div>
    );
}
