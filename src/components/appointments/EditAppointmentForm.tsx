'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { CombineDateTime } from "@/lib/utils/formating";
import { UpdateAppointment } from "@/lib/data/backend/clientCalls";
import { Appointment, AppointmentOutcome } from "@/lib/definitions/backend/appointments";

interface EditAppointmentFormProps {
    appointment: Appointment;
}

export function EditAppointmentForm({ appointment }: EditAppointmentFormProps) {
    const router = useRouter();

    const scheduledAt = new Date(appointment.ScheduledAt);

    const date = scheduledAt.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = scheduledAt.toTimeString().slice(0, 5);  // HH:MM (24-hour)
    console.log("Date:", date, "Time:", time);

    // ---- State ----
    const [title, setTitle] = useState(appointment.Title);
    const [scheduledDate, setScheduledDate] = useState(date);
    const [scheduledTime, setScheduledTime] = useState(time);
    const [notes, setNotes] = useState(appointment.Note.Valid ? appointment.Note.String : "");
    const [outcome, setOutcome] = useState(appointment.Outcome.Valid ? appointment.Outcome.AppointmentOutcome : "no-outcome");
    const [location, setLocation] = useState(appointment.Location.Valid ? appointment.Location.String : "");
    const [type, setType] = useState(appointment.Type.Valid ? appointment.Type.AppointmentType : "");

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



    // ---- Submit ----
    const handleUpdate = async () => {
        const scheduledAt = CombineDateTime(scheduledDate, scheduledTime);

        try {
            await UpdateAppointment(
                appointment.ID,
                appointment.ContactID as unknown as string,
                title,
                scheduledAt,
                notes,
                outcome,
                location,
                type
            );

            toast.success("Appointment updated!");
            router.refresh();
        } catch {
            toast.error("Failed to update appointment.");
        }
    };

    return (
        <div className="space-y-6">


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
                    onChange={(e) => setOutcome(e.target.value as AppointmentOutcome)}
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
            <Button className="w-full" onClick={handleUpdate}>
                Update Appointment
            </Button>
        </div>
    );
}
