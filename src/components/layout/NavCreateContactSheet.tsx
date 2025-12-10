"use client";

import { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import CreateContactForm from "./CreateContactForm";

export default function NavCreateContactModal() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">
                    + New Contact
                </button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Contact</DialogTitle>
                    <DialogDescription>
                        Enter the contact details below.
                    </DialogDescription>
                </DialogHeader>

                <CreateContactForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
