import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreateEmail, DeleteEmail, UpdateEmail } from "@/lib/data/backend/clientCalls";
import { ContactWithDetails } from "@/lib/definitions/backend/contacts";
import { Email } from "@/lib/definitions/backend/emails";
import { PhoneNumber } from "@/lib/definitions/backend/phoneNumbers";
import { formatPhoneNumber } from "@/lib/utils/formating";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DetailsManagementModalProps {
    emails?: Email[];
    phones?: PhoneNumber[];
    contact: ContactWithDetails;
    variant: 'email' | 'phone' | 'details';
}


export default function DetailsManagementModal(props: DetailsManagementModalProps) {
    const { emails, phones, contact, variant } = props;
    const [open, setOpen] = useState(false);
    const router = useRouter()

    // Email Editing State
    const [editingEmailId, setEditingEmailId] = useState<string | null>(null)
    const [emailDraft, setEmailDraft] = useState({
        email_address: '',
        type: 'Primary',
    })
    const [isAddingEmail, setIsAddingEmail] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Phone Editing State
    const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null)
    const [phoneDraft, setPhoneDraft] = useState({
        phone_number: '',
        type: 'Mobile',
    })
    const [isAddingPhone, setIsAddingPhone] = useState(false)
    const [isPhoneSaving, setIsPhoneSaving] = useState(false)


    // Email Handlers
    const startEdit = (email: Email) => {
        setEditingEmailId(email.id)
        setEmailDraft({
            email_address: email.email_address,
            type: email.type,
        })
    }

    const cancelEdit = () => {
        setEditingEmailId(null)
        setIsAddingEmail(false)
        setEmailDraft({ email_address: '', type: 'Primary' })
    }

    const saveEmail = async (emailId?: string) => {
        if (!emailDraft.email_address.trim()) return

        setIsSaving(true)

        if (emailId) {
            // UPDATE
            await UpdateEmail(emailId, emailDraft.email_address, emailDraft.type, false)
        } else {
            // CREATE
            await CreateEmail(contact.ID, emailDraft.email_address, emailDraft.type, false)
        }

        setIsSaving(false)
        cancelEdit()
        router.refresh() // or re-fetch emails
    }

    // Phone Handlers
    const startEditPhone = (phone: PhoneNumber) => {
        setEditingPhoneId(phone.id)
        setPhoneDraft({
            phone_number: phone.phone_number,
            type: phone.type,
        })
    }

    const cancelPhoneEdit = () => {
        setEditingPhoneId(null)
        setIsAddingPhone(false)
        setPhoneDraft({ phone_number: '', type: 'mobile' })
    }

    const savePhone = async (phoneId?: string) => {
        if (!emailDraft.email_address.trim()) return

        setIsSaving(true)

        if (phoneId) {
            // UPDATE
            await fetch(`/api/emails/${phoneId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(phoneDraft),
            })
        } else {
            // CREATE
            await fetch(`/api/emails`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contact_id: contact.ID,
                    ...phoneDraft,
                }),
            })
        }

        setIsPhoneSaving(false)
        cancelPhoneEdit()
        router.refresh()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 
                       text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 
                       dark:hover:bg-zinc-800"
                >
                    +
                </button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto">
                {variant === 'email' ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Manage Emails</DialogTitle>
                            <DialogDescription>
                                Add, Delete or Edit Contact Emails
                            </DialogDescription>
                        </DialogHeader>

                        {emails && emails.length > 0 ? (
                            <div className="mt-6 space-y-4">
                                {emails.map((email) => {
                                    const isEditing = editingEmailId === email.id

                                    return (
                                        <div
                                            key={email.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            {isEditing ? (
                                                <div className="flex w-full items-center gap-2">
                                                    <Input
                                                        value={emailDraft.email_address}
                                                        onChange={(e) =>
                                                            setEmailDraft({ ...emailDraft, email_address: e.target.value })
                                                        }
                                                        placeholder="Email address"
                                                    />

                                                    <select
                                                        value={emailDraft.type}
                                                        onChange={(e) =>
                                                            setEmailDraft({ ...emailDraft, type: e.target.value })
                                                        }
                                                        className="rounded-md border px-2 py-1 text-sm"
                                                    >
                                                        <option value="Primary">Primary</option>
                                                        <option value="Work">Work</option>
                                                        <option value="Personal">Personal</option>
                                                    </select>

                                                    <Button size="sm" onClick={() => saveEmail(email.id)} disabled={isSaving}>
                                                        Save
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div>
                                                        <p className="font-medium">{email.email_address}</p>
                                                        <p className="text-sm text-zinc-500">{email.type}</p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => startEdit(email)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={async () => {
                                                                await DeleteEmail(email.id)
                                                                router.refresh()
                                                            }}
                                                        >
                                                            X
                                                        </Button>
                                                    </div>
                                                </>
                                            )}

                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="mt-6 text-center text-zinc-500">
                                No emails found for this contact.
                            </div>
                        )}

                        {isAddingEmail && (
                            <div className="mt-4 flex items-center gap-2 rounded-lg border p-4">
                                <Input
                                    value={emailDraft.email_address}
                                    onChange={(e) =>
                                        setEmailDraft({ ...emailDraft, email_address: e.target.value })
                                    }
                                    placeholder="Email address"
                                />

                                <select
                                    value={emailDraft.type}
                                    onChange={(e) =>
                                        setEmailDraft({ ...emailDraft, type: e.target.value })
                                    }
                                    className="rounded-md border px-2 py-1 text-sm"
                                >
                                    <option value="Primary">Primary</option>
                                    <option value="Work">Work</option>
                                    <option value="Personal">Personal</option>
                                </select>

                                <Button onClick={() => saveEmail()} disabled={isSaving}>
                                    Add
                                </Button>
                                <Button variant="outline" onClick={cancelEdit}>
                                    Cancel
                                </Button>
                            </div>
                        )}
                        <Button
                            variant="secondary"
                            className="mt-4"
                            onClick={() => {
                                setIsAddingEmail(true)
                                setEditingEmailId(null)
                                setEmailDraft({ email_address: '', type: 'Primary' })
                            }}
                        >
                            + Add Email
                        </Button>

                        <DialogFooter className="mt-6">
                            <Button onClick={() => saveEmail}>Save</Button>
                        </DialogFooter>
                    </>
                ) : variant === 'phone' ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Manage Phone Numbers</DialogTitle>
                            <DialogDescription>
                                Add, Delete or Edit Contact Phone Numbers
                            </DialogDescription>
                        </DialogHeader>

                        {phones && phones.length > 0 ? (
                            <div className="mt-6 space-y-4">
                                {phones.map((phone) => (
                                    <div key={phone.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <p className="font-medium">{formatPhoneNumber(phone.phone_number)}</p>
                                            <p className="text-sm text-zinc-500">{phone.type}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm"><Pencil /></Button>
                                            <Button variant="destructive" size="sm">X</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 text-center text-zinc-500">
                                No phone numbers found for this contact.
                            </div>
                        )}

                        {isAddingPhone && (
                            <div className="mt-4 flex items-center gap-2 rounded-lg border p-4">
                                <Input
                                    value={phoneDraft.phone_number}
                                    onChange={(e) =>
                                        setPhoneDraft({ ...phoneDraft, phone_number: e.target.value })
                                    }
                                    placeholder="Phone number"
                                />

                                <select
                                    value={phoneDraft.type}
                                    onChange={(e) =>
                                        setPhoneDraft({ ...phoneDraft, type: e.target.value })
                                    }
                                    className="rounded-md border px-2 py-1 text-sm"
                                >
                                    <option value="Primary">Primary</option>
                                    <option value="Work">Work</option>
                                    <option value="Personal">Personal</option>
                                </select>

                                <Button onClick={() => savePhone()} disabled={isPhoneSaving}>
                                    Add
                                </Button>
                                <Button variant="outline" onClick={cancelPhoneEdit}>
                                    Cancel
                                </Button>
                            </div>
                        )}

                        <Button
                            variant="secondary"
                            className="mt-4"
                            onClick={() => {
                                setIsAddingPhone(true)
                                setEditingPhoneId(null)
                                setPhoneDraft({ phone_number: '', type: 'Mobile' })
                            }}
                        >
                            + Add Phone Number
                        </Button>


                        <DialogFooter className="mt-6">
                            <Button onClick={() => savePhone}>Save</Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Manage Contact Details</DialogTitle>
                            <DialogDescription>
                                Edit Contact Details
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6 space-y-6">
                            <Button variant="outline" className="w-full">Edit Details</Button>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button onClick={() => savePhone}>Save</Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
