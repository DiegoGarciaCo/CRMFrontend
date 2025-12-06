"use client";

import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import CreateContactForm from "./CreateContactForm";

export default function NavCreateContactSheet() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">
                    + New Contact
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
