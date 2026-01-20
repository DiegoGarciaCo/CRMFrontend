"use client";

import { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import CreateTaskForm from "../layout/CreateTaskForm";


interface CreateTaskModalProps {
    variant: "button" | "action" | "plus";
    contactId?: string;
}

export default function CreateTaskModal({ variant, contactId }: CreateTaskModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {variant === "action" ? (

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
                ) : variant === "button" ? (

                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                        + New Task
                    </button>
                ) : (
                    <button className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                )}
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogDescription>
                        Enter task details below.
                    </DialogDescription>
                </DialogHeader>

                <CreateTaskForm contactId={contactId} />

                <DialogFooter />
            </DialogContent>
        </Dialog>
    );
}
