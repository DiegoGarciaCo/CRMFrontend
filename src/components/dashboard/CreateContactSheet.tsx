"use client";

import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import CreateContactForm from "../layout/CreateContactForm";

export default function CreateContactSheet() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 text-left transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium">Add Contact</p>
                        <p className="text-xs text-zinc-500">Create new lead</p>
                    </div>
                </button>
            </SheetTrigger>

            <SheetContent className="overflow-y-auto sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Create Contact</SheetTitle>
                    <SheetDescription>Enter the contact details below.</SheetDescription>
                </SheetHeader>

                <CreateContactForm
                    onSuccess={() => setOpen(false)}
                />
            </SheetContent>
        </Sheet>
    );
}
