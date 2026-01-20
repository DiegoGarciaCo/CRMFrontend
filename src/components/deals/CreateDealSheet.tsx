"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import type { Contact } from "@/lib/definitions/backend/contacts";
import type { Stage } from "@/lib/definitions/backend/stage";
import { CreateDeal, SearchContacts } from "@/lib/data/backend/clientCalls";
import { useRouter } from "next/navigation";

interface CreateDealModalProps {
    stages: Stage[];
    variant: "button" | "action" | "plus";
    contactId?: string;
}

export default function CreateDealModal({ stages, variant, contactId }: CreateDealModalProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Contact search
    const [contactSearch, setContactSearch] = useState("");
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<string>("");
    const [loading, setLoading] = useState(false);

    // Stage selection
    const [selectedStage, setSelectedStage] = useState<string>("");

    // Deal fields
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [closingDate, setClosingDate] = useState("");
    const [earnestDate, setEarnestDate] = useState("");
    const [mutualDate, setMutualDate] = useState("");
    const [inspectionDate, setInspectionDate] = useState("");
    const [appraisalDate, setAppraisalDate] = useState("");
    const [walkthroughDate, setWalkthroughDate] = useState("");
    const [possessionDate, setPossessionDate] = useState("");
    const [closedDate, setClosedDate] = useState("");
    const [commission, setCommission] = useState("");
    const [commissionSplit, setCommissionSplit] = useState("");

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");

    const [description, setDescription] = useState("");

    // Contact search debounce
    useEffect(() => {
        const delay = setTimeout(async () => {
            if (contactSearch.trim().length > 1) {
                try {
                    setLoading(true);
                    const results = await SearchContacts(contactSearch);
                    if (results != null) {
                        setContacts(results);
                        setLoading(false);
                    } else {
                        setContacts([]);
                        setLoading(false);
                    }
                } catch {
                    setLoading(false);
                    toast.error("Error searching contacts.");
                }
            } else setContacts([]);
        }, 350);

        return () => clearTimeout(delay);
    }, [contactSearch]);

    const handleCreate = async () => {
        if (!selectedContact && !contactId) return toast.error("Please select a contact");
        if (!selectedStage) return toast.error("Please select a stage");

        try {
            console.log(contactId)
            const contact = contactId || selectedContact;
            await CreateDeal(
                contact,
                title,
                Number(price),
                closingDate,
                earnestDate,
                mutualDate,
                inspectionDate,
                appraisalDate,
                walkthroughDate,
                possessionDate,
                closedDate,
                Number(commission),
                Number(commissionSplit),
                address,
                city,
                state,
                zip,
                description,
                selectedStage
            );

            toast.success("Deal created!");
            router.refresh();
            setOpen(false);
        } catch (err) {
            toast.error("Failed to create deal.");
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {variant === "button" ? (

                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        + New Deal
                    </button>
                ) : (

                    <button className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader className="sticky top-0 bg-white dark:bg-zinc-950 z-10">
                    <DialogTitle>Create Deal</DialogTitle>
                    <DialogDescription>Enter the deal details below.</DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-6 overflow-y-auto flex-1 pr-2">
                    {/* CONTACT SEARCH */}
                    {!contactId && (
                        <div className="space-y-2">
                            <Label>Select Contact</Label>

                            <Input
                                placeholder="Search contacts..."
                                value={contactSearch}
                                onChange={(e) => setContactSearch(e.target.value)}
                            />

                            {contacts.length > 0 ? (
                                <div className="rounded border p-2 bg-white dark:bg-zinc-900 max-h-40 overflow-y-auto">
                                    {contacts.map((c) => (
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
                            ) : (
                                // Show "No contacts found" *only if* user typed something AND results came back empty
                                contactSearch.length > 0 && !loading && (
                                    <div className="rounded border p-2 bg-white dark:bg-zinc-900 max-h-40 overflow-y-auto">
                                        <p className="block w-full text-left p-2 rounded text-zinc-500">
                                            No contacts found.
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                    {/* STAGE SELECT */}
                    <div className="space-y-2">
                        <Label>Stage</Label>
                        <select
                            className="w-full border rounded p-2 bg-white dark:bg-zinc-900"
                            value={selectedStage}
                            onChange={(e) => setSelectedStage(e.target.value)}
                        >
                            <option value="">Select stage...</option>
                            {stages.map((s) => (
                                <option key={s.ID} value={s.ID}>
                                    {s.Name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* BASIC FIELDS */}
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Price</Label>
                        <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-1 gap-4 space-y-2 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <Label>Closing Date</Label>
                            <Input className="mt-2" type="date" value={closingDate} onChange={(e) => setClosingDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Earnest Money Due</Label>
                            <Input className="mt-2" type="date" value={earnestDate} onChange={(e) => setEarnestDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Mutual Acceptance</Label>
                            <Input className="mt-2" type="date" value={mutualDate} onChange={(e) => setMutualDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Inspection</Label>
                            <Input className="mt-2" type="date" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Appraisal</Label>
                            <Input className="mt-2" type="date" value={appraisalDate} onChange={(e) => setAppraisalDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Final Walkthrough</Label>
                            <Input className="mt-2" type="date" value={walkthroughDate} onChange={(e) => setWalkthroughDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Possession</Label>
                            <Input className="mt-2" type="date" value={possessionDate} onChange={(e) => setPossessionDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Closed</Label>
                            <Input className="mt-2" type="date" value={closedDate} onChange={(e) => setClosedDate(e.target.value)} />
                        </div>
                    </div>

                    {/* COMMISSION */}
                    <div className="space-y-2">
                        <Label>Commission (%)</Label>
                        <Input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Commission Split (%)</Label>
                        <Input type="number" value={commissionSplit} onChange={(e) => setCommissionSplit(e.target.value)} />
                    </div>

                    {/* ADDRESS */}
                    <div className="space-y-2">
                        <Label>Property Address</Label>
                        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <Label>City</Label>
                            <Input value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <Label>State</Label>
                            <Input value={state} onChange={(e) => setState(e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <Label>Zip</Label>
                            <Input value={zip} onChange={(e) => setZip(e.target.value)} />
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>

                <DialogFooter className="sticky bottom-0 bg-white dark:bg-zinc-950 z-10 mt-4">
                    <Button onClick={handleCreate}>Create Deal</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
