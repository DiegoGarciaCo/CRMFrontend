"use client";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CreateAppointmentForm } from "../layout/CreateAppointmentForm";


export default function CreateAppointmentModal({ ownerId, variant }: { ownerId: string, variant: "button" | "action" }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {variant === "action" ? (

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
                ) : (

                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                        + New Appointment
                    </button>
                )}
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Schedule Appointment</DialogTitle>
                    <DialogDescription>
                        Fill out the appointment details below.
                    </DialogDescription>
                </DialogHeader>

                <CreateAppointmentForm
                    ownerId={ownerId}
                />
            </DialogContent>
        </Dialog>
    );
}
