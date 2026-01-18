"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Task } from "@/lib/definitions/backend/tasks";
import { DeleteTask, UpdateTask } from "@/lib/data/backend/clientCalls";
import { CombineDateTime } from "@/lib/utils/formating";
import { useRouter } from "next/navigation";

interface UpdateTaskFormProps {
    task: Task;
    setOpen: (open: boolean) => void;
}

export default function UpdateTaskForm({ task, setOpen }: UpdateTaskFormProps) {
    const router = useRouter();

    // ---- Pre-fill date + time ----
    const scheduledAt = new Date(task.Date.Valid ? task.Date.Time : new Date());

    const date = scheduledAt.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = scheduledAt.toTimeString().slice(0, 5);  // HH:MM (24-hour)

    // ---- State ----
    const [title, setTitle] = useState(task.Title);
    const [type, setType] = useState(task.Type.Valid ? task.Type.TaskType : "");
    const [scheduledDate, setScheduledDate] = useState(date);
    const [scheduledTime, setScheduledTime] = useState(time);
    const [status, setStatus] = useState(task.Status.Valid ? task.Status.TaskStatus : "");
    const [priority, setPriority] = useState(task.Priority.Valid ? task.Priority.TaskPriority : "");
    const [note, setNote] = useState(task.Note.Valid ? task.Note.String : "");


    // ---- Update handler ----
    const handleUpdate = async () => {
        let scheduledAt = "";
        if (scheduledDate) {
            scheduledAt = scheduledTime
                ? CombineDateTime(scheduledDate, scheduledTime)
                : scheduledDate;
        }

        try {
            await UpdateTask(
                task.ID,
                task.ContactID as unknown as string,
                task.AssignedToID as unknown as string,
                title,
                type,
                scheduledAt,
                status,
                priority,
                note
            );

            toast.success("Task updated!");
            if (setOpen) setOpen(false);
            router.refresh();
        } catch {
            toast.error("Failed to update task.");
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
    ];

    const taskStatus = [
        { label: "Pending", value: "pending" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
    ];

    const taskPriority = [
        { label: "Low", value: "low" },
        { label: "Normal", value: "normal" },
        { label: "High", value: "high" },
    ];

    const handleDelete = async () => {
        try {
            await DeleteTask(task.ID);
            toast.success("Task deleted!");
            router.refresh();
        } catch {
            toast.error("Failed to delete task.");
        }
    };

    return (
        <div className="mt-6 space-y-6">

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
            <div className="pt-4 flex justify-between gap-4 w-full">
                <Button className="flex-1" onClick={handleUpdate}>Update Task</Button>
                <Button className="flex-1" type="button" variant="destructive" onClick={handleDelete}>Delete Task</Button>
            </div>
        </div>
    );
}
