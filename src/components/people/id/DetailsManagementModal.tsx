import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { AddCollaboratorToContact, CreateEmail, CreatePhoneNumber, DeleteEmail, DeletePhoneNumber, GetOrganizationMembers, RemoveCollaboratorFromContact, UpdateContact, UpdateEmail, UpdatePhoneNumber } from "@/lib/data/backend/clientCalls";
import { Collaborator } from "@/lib/definitions/backend/collaborators";
import { ContactWithDetails } from "@/lib/definitions/backend/contacts";
import { Email } from "@/lib/definitions/backend/emails";
import { PhoneNumber } from "@/lib/definitions/backend/phoneNumbers";
import { formatPhoneNumber } from "@/lib/utils/formating";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DetailsManagementModalProps {
    emails?: Email[];
    phones?: PhoneNumber[];
    collaborators?: Collaborator[];
    contact: ContactWithDetails;
    variant: 'email' | 'phone' | 'details' | 'collaborators';
}


export default function DetailsManagementModal(props: DetailsManagementModalProps) {
    const { emails, phones, collaborators, contact, variant } = props;
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

    // Contact Details State
    const [detailsDraft, setDetailsDraft] = useState({
        firstName: contact.FirstName,
        lastName: contact.LastName,
        address: contact.Address.Valid ? contact.Address.String : '',
        city: contact.City.Valid ? contact.City.String : '',
        state: contact.State.Valid ? contact.State.String : '',
        zipCode: contact.ZipCode.Valid ? contact.ZipCode.String : '',
        birthdate: contact.Birthdate.Valid ? contact.Birthdate.Time : '',
        status: contact.Status.Valid ? contact.Status.String : '',
        source: contact.Source.Valid ? contact.Source.String : '',
        priceRange: contact.PriceRange.Valid ? contact.PriceRange.String : '',
        timeframe: contact.Timeframe.Valid ? contact.Timeframe.String : '',
        lender: contact.Lender.Valid ? contact.Lender.String : '',
    })
    const [isDetailsSaving, setIsDetailsSaving] = useState(false)
    const [isEditingDetails, setIsEditingDetails] = useState(false)

    const initialDetailsDraft = {
        firstName: contact.FirstName,
        lastName: contact.LastName,
        address: contact.Address.Valid ? contact.Address.String : '',
        city: contact.City.Valid ? contact.City.String : '',
        state: contact.State.Valid ? contact.State.String : '',
        zipCode: contact.ZipCode.Valid ? contact.ZipCode.String : '',
        birthdate: contact.Birthdate.Valid ? contact.Birthdate.Time : '',
        status: contact.Status.Valid ? contact.Status.String : '',
        source: contact.Source.Valid ? contact.Source.String : '',
        priceRange: contact.PriceRange.Valid ? contact.PriceRange.String : '',
        timeframe: contact.Timeframe.Valid ? contact.Timeframe.String : '',
        lender: contact.Lender.Valid ? contact.Lender.String : '',
    }

    // Collaborators State
    const [isAddingCollaborator, setIsAddingCollaborator] = useState(false)
    const [selectedOrganization, setSelectedOrganization] = useState<string>('')
    const [selectedMember, setSelectedMember] = useState<string>('')
    const [selectedRole, setSelectedRole] = useState<string>('co-list')
    const [organizationCollaborators, setOrganizationCollaborators] = useState<Collaborator[]>([])
    const { data } = authClient.useListOrganizations()
    const organizations = data?.map(org => ({ id: org.id, name: org.name }))

    // Get List of Collaborators
    useEffect(() => {
        if (variant === 'collaborators') {
            const fetchCollaborators = async () => {
                if (selectedOrganization) {
                    try {
                        if (!organizations) return setOrganizationCollaborators([])
                        const members = await GetOrganizationMembers(organizations.map(org => org.id))
                        setOrganizationCollaborators(members)
                    } catch (error) {
                        console.log('Error fetching organization members:', error)
                    }
                } else {
                    setOrganizationCollaborators([])
                }
            }
            fetchCollaborators()
        }
    }, [variant, selectedOrganization])


    // Add Collaborator 
    const addCollaborator = async () => {
        if (!selectedMember) return

        setIsAddingCollaborator(true)

        try {
            await AddCollaboratorToContact(contact.ID, selectedMember, selectedRole)

            setIsAddingCollaborator(false)
            setSelectedMember('')
            setSelectedRole('co-list')
        } catch (error) {
            console.log('Error adding collaborator:', error)
            toast.error('Failed to add collaborator. Please try again.')
        }

        setIsAddingCollaborator(false)
        router.refresh()
    }

    // Delete Collaborator
    const deleteCollaborator = async (collaboratorId: string) => {
        try {
            await RemoveCollaboratorFromContact(contact.ID, collaboratorId)
            router.refresh()
        } catch (error) {
            console.log('Error deleting collaborator:', error)
            toast.error('Failed to delete collaborator. Please try again.')
        }
    }

    const saveDetails = async () => {
        setIsDetailsSaving(true)

        try {
            await UpdateContact(contact.ID, detailsDraft.firstName, detailsDraft.lastName, detailsDraft.birthdate, detailsDraft.source, detailsDraft.status, detailsDraft.address, detailsDraft.city, detailsDraft.state, detailsDraft.zipCode, detailsDraft.lender, detailsDraft.priceRange, detailsDraft.timeframe)
        }
        catch (error) {
            console.log(error)
        }

        setIsDetailsSaving(false)
        setOpen(false)
        router.refresh()
    }


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
            setEditingEmailId(null)
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
        if (!phoneDraft.phone_number.trim()) return

        setIsPhoneSaving(true)

        if (phoneId) {
            // UPDATE
            await UpdatePhoneNumber(phoneId, phoneDraft.phone_number, phoneDraft.type, false)
            setEditingPhoneId(null)
        } else {
            // CREATE
            await CreatePhoneNumber(contact.ID, phoneDraft.phone_number, phoneDraft.type, false)
        }

        setIsPhoneSaving(false)
        cancelPhoneEdit()
        router.refresh()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {variant == "details" ? (
                    <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <button
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 
                       text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 
                       dark:hover:bg-zinc-800"
                    >
                        +
                    </button>
                )}
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
                                {phones.map((phone) => {
                                    const isEditing = editingPhoneId === phone.id

                                    return (
                                        <div
                                            key={phone.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            {isEditing ? (
                                                <div className="flex w-full items-center gap-2">
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
                                                        <option value="Mobile">Mobile</option>
                                                        <option value="Work">Work</option>
                                                        <option value="Personal">Personal</option>
                                                    </select>

                                                    <Button size="sm" onClick={() => savePhone(phone.id)} disabled={isPhoneSaving}>
                                                        Save
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={cancelPhoneEdit}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div>
                                                        <p className="font-medium">{formatPhoneNumber(phone.phone_number)}</p>
                                                        <p className="text-sm text-zinc-500">{phone.type}</p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => startEditPhone(phone)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={async () => {
                                                                await DeletePhoneNumber(phone.id)
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
                ) : variant === 'details' ? (
                    <>
                        <DialogHeader className="flex flex-row items-start justify-between">
                            <div>
                                <DialogTitle>Contact Details</DialogTitle>
                                <DialogDescription>
                                    View and edit contact information
                                </DialogDescription>
                            </div>

                            {!isEditingDetails && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setIsEditingDetails(true)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            )}
                        </DialogHeader>

                        <div className="mt-6 grid gap-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* First Name */}
                                <div>
                                    <label className="text-xs text-zinc-500">First Name</label>
                                    {isEditingDetails ? (
                                        <Input
                                            value={detailsDraft.firstName}
                                            onChange={(e) =>
                                                setDetailsDraft({ ...detailsDraft, firstName: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <p className="text-sm">{detailsDraft.firstName || '—'}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="text-xs text-zinc-500">Last Name</label>
                                    {isEditingDetails ? (
                                        <Input
                                            value={detailsDraft.lastName}
                                            onChange={(e) =>
                                                setDetailsDraft({ ...detailsDraft, lastName: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <p className="text-sm">{detailsDraft.lastName || '—'}</p>
                                    )}
                                </div>
                            </div>
                            {/* Address */}
                            <div>
                                <label className="text-xs text-zinc-500">Street Address</label>
                                {isEditingDetails ? (
                                    <Input
                                        value={detailsDraft.address}
                                        onChange={(e) =>
                                            setDetailsDraft({ ...detailsDraft, address: e.target.value })
                                        }
                                    />
                                ) : (
                                    <p className="text-sm">{detailsDraft.address || '—'}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs text-zinc-500">City</label>
                                    {isEditingDetails ? (
                                        <Input
                                            value={detailsDraft.city}
                                            onChange={(e) =>
                                                setDetailsDraft({ ...detailsDraft, city: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <p className="text-sm">{detailsDraft.city || '—'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs text-zinc-500">State</label>
                                    {isEditingDetails ? (
                                        <Input
                                            value={detailsDraft.state}
                                            onChange={(e) =>
                                                setDetailsDraft({ ...detailsDraft, state: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <p className="text-sm">{detailsDraft.state || '—'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs text-zinc-500">Zip Code</label>
                                    {isEditingDetails ? (
                                        <Input
                                            value={detailsDraft.zipCode}
                                            onChange={(e) =>
                                                setDetailsDraft({ ...detailsDraft, zipCode: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <p className="text-sm">{detailsDraft.zipCode || '—'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Birthdate */}
                            <div>
                                <label className="text-xs text-zinc-500">Birthdate</label>
                                {isEditingDetails ? (
                                    <Input
                                        type="date"
                                        value={detailsDraft.birthdate?.slice(0, 10) ?? ''}
                                        onChange={(e) =>
                                            setDetailsDraft({ ...detailsDraft, birthdate: e.target.value })
                                        }
                                    />
                                ) : (
                                    <p className="text-sm">
                                        {detailsDraft.birthdate
                                            ? new Date(detailsDraft.birthdate).toLocaleDateString()
                                            : '—'}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-xs text-zinc-500">Status</label>
                                {isEditingDetails ? (
                                    <Input
                                        value={detailsDraft.status}
                                        onChange={(e) =>
                                            setDetailsDraft({ ...detailsDraft, status: e.target.value })
                                        }
                                    />
                                ) : (
                                    <p className="text-sm">{detailsDraft.status || '—'}</p>
                                )}
                            </div>

                            {/* Source */}
                            <div>
                                <label className="text-xs text-zinc-500">Source</label>
                                {isEditingDetails ? (
                                    <Input
                                        value={detailsDraft.source}
                                        onChange={(e) =>
                                            setDetailsDraft({ ...detailsDraft, source: e.target.value })
                                        }
                                    />
                                ) : (
                                    <p className="text-sm">{detailsDraft.source || '—'}</p>
                                )}
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="text-xs text-zinc-500">Price Range</label>
                                {isEditingDetails ? (
                                    <Input
                                        value={detailsDraft.priceRange}
                                        onChange={(e) =>
                                            setDetailsDraft({ ...detailsDraft, priceRange: e.target.value })
                                        }
                                    />
                                ) : (
                                    <p className="text-sm">{detailsDraft.priceRange || '—'}</p>
                                )}
                            </div>

                            {/* Timeframe */}
                            <div>
                                <label className="text-xs text-zinc-500">Timeframe</label>
                                {isEditingDetails ? (
                                    <select
                                        value={detailsDraft.timeframe}
                                        onChange={(e) =>
                                            setDetailsDraft({ ...detailsDraft, timeframe: e.target.value })
                                        }
                                        className="w-full rounded-md border px-2 py-2 text-sm"
                                    >
                                        <option value="">None</option>
                                        <option value="Immediate">Immediate</option>
                                        <option value="1–3 Months">1–3 Months</option>
                                        <option value="3–6 Months">3–6 Months</option>
                                        <option value="6+ Months">6+ Months</option>
                                    </select>
                                ) : (
                                    <p className="text-sm">{detailsDraft.timeframe || '—'}</p>
                                )}
                            </div>

                            {/* Lender */}
                            <div>
                                <label className="text-xs text-zinc-500">Lender</label>
                                {isEditingDetails ? (
                                    <Input
                                        value={detailsDraft.lender}
                                        onChange={(e) =>
                                            setDetailsDraft({ ...detailsDraft, lender: e.target.value })
                                        }
                                    />
                                ) : (
                                    <p className="text-sm">{detailsDraft.lender || '—'}</p>
                                )}
                            </div>
                        </div>

                        {isEditingDetails && (
                            <DialogFooter className="mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setDetailsDraft(initialDetailsDraft)
                                        setIsEditingDetails(false)
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button onClick={saveDetails} disabled={isDetailsSaving}>
                                    {isDetailsSaving ? 'Saving…' : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        )}
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Collaborators</DialogTitle>
                            <DialogDescription>
                                Manage contact collaborators
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6 text-center">
                            {collaborators?.length === 0 && !isAddingCollaborator
                                ? (
                                    <div className="flext items-center justify-center mt-6 text-center text-zinc-500">
                                        <p>No Collaborators for this contact</p>
                                    </div>
                                )
                                : (
                                    <div className="mt-6 space-y-4">
                                        {collaborators?.map((collaborator) => (
                                            <div
                                                key={collaborator.id}
                                                className="flex items-center justify-between rounded-lg border p-4"
                                            >
                                                <div>
                                                    <p className="font-medium">{collaborator.name}</p>
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={async () => {
                                                        await deleteCollaborator(collaborator.id)
                                                        router.refresh()
                                                    }}
                                                >
                                                    X
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            {isAddingCollaborator && (
                                <div>
                                    <div className="flex justify-around items-center">
                                        <select
                                            value={selectedMember}
                                            onChange={(e) =>
                                                setSelectedMember(e.target.value)
                                            }
                                            className="w-full rounded-md border px-2 py-2 text-sm"
                                        >
                                            {organizationCollaborators.map((member) => (
                                                <option key={member.id} value={member.id}>
                                                    {member.name}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={selectedRole}
                                            onChange={(e) =>
                                                setSelectedRole(e.target.value)
                                            }
                                            className="ml-4 rounded-md border px-2 py-2 text-sm"
                                        >
                                            <option value="lead-realtor">Lead Realtor</option>
                                            <option value="co-list">Co-List</option>
                                            <option value="Lender">Lender</option>
                                        </select>
                                        <select
                                            value={selectedOrganization}
                                            onChange={(e) =>
                                                setSelectedOrganization(e.target.value)
                                            }
                                            className="ml-4 rounded-md border px-2 py-2 text-sm"
                                        >
                                            {organizations?.map((org) => (
                                                <option key={org.id} value={org.id}>
                                                    {org.name}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                    <Button
                                        className="w-full mt-2"
                                        onClick={async () => {
                                            await addCollaborator()
                                            setIsAddingCollaborator(false)
                                            router.refresh()
                                        }}
                                    >
                                        Add
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-1"
                                        onClick={() => {
                                            setIsAddingCollaborator(false)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                variant="secondary"
                                className="mt-4 w-full"
                                onClick={() => {
                                    setIsAddingCollaborator(true)
                                }}
                            >
                                + Add Collaborator
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
