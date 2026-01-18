'use client';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Appointment } from "@/lib/definitions/backend/appointments";
import { useState } from "react";
import { EditAppointmentForm } from "./EditAppointmentForm";
import { TableCell, TableRow } from "../ui/table";
import { FormatDateTimeForInput } from "@/lib/utils/formating";


interface EditAppointmentModalProps {
    variant: "table-cell" | "upcoming" | "week";
    appointment: Appointment;
    children?: React.ReactNode; // optional for custom triggers
}

export default function EditAppointmentModal({ variant, appointment }: EditAppointmentModalProps) {
    const [open, setOpen] = useState(false);

    const renderTrigger = () => {

        const formatedDate = FormatDateTimeForInput(new Date(appointment.ScheduledAt));
        const date = formatedDate.split(' ')[0];
        const time = formatedDate.split(' ')[1] + ` ${formatedDate.split(' ')[2]}`;
        switch (variant) {
            case "table-cell":

                return (
                    <TableRow
                        className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                        <TableCell className="font-medium">{appointment.Title}</TableCell>

                        <TableCell>
                            {appointment.Type.Valid && (
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getAppointmentTypeColor(
                                        appointment.Type.AppointmentType
                                    )}`}
                                >
                                    {appointment.Type.AppointmentType.replace("-", " ")}
                                </span>
                            )}
                        </TableCell>

                        <TableCell>{date}</TableCell>
                        <TableCell>{time}</TableCell>
                    </TableRow>
                );

            case "upcoming":
                return (
                    <div
                        key={appointment.ID}
                        className="cursor-pointer rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{appointment.Title}</h3>
                                    {appointment.Type.Valid && (
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${getAppointmentTypeColor(appointment.Type.AppointmentType).split(' ').slice(0, 2).join(' ')}`}
                                        >
                                            {appointment.Type.AppointmentType.replace('-', ' ')}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-2 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                                    <div className="flex items-center gap-1">
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{date}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{time}</span>
                                    </div>

                                    {appointment.Location.Valid && (
                                        <div className="flex items-center gap-1">
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{appointment.Location.String}</span>
                                        </div>
                                    )}
                                </div>

                                {appointment.Note.Valid && appointment.Note.String && (
                                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{appointment.Note.String}</p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case "week":
                return (
                    <div className={`cursor-pointer rounded-lg border p-2 text-xs transition-all hover:shadow-md ${getAppointmentTypeColor(appointment.Type.Valid ? appointment.Type.AppointmentType : 'no-type')}`}>
                        <div className="font-medium">{time}</div>
                        <div className="mt-1 truncate">{appointment.Title}</div>
                    </div>
                );

            default:
                return <button>Edit Appointment</button>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {renderTrigger()}
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Appointment</DialogTitle>
                    <DialogDescription>
                        Update the details of this appointment.
                    </DialogDescription>
                </DialogHeader>

                <EditAppointmentForm appointment={appointment} />
            </DialogContent>
        </Dialog>
    );
}

// --------------------
// Helper functions
// --------------------
function getAppointmentTypeColor(type: string) {
    switch (type.toLowerCase()) {
        case "buyer-appointment":
            return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
        case "listing-appointment":
            return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        case "showing":
            return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
        case "inspection":
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        case "appraisal":
            return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
        case "open-house":
            return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400";
        default:
            return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
    }
}
