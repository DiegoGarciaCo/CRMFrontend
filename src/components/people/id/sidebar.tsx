'use client';

import { Badge } from '@/components/ui/badge';
import { ContactWithDetails } from '@/lib/definitions/backend/contacts';
import { Email } from '@/lib/definitions/backend/emails';
import { PhoneNumber } from '@/lib/definitions/backend/phoneNumbers';
import { formatDate, formatPhoneNumber } from '@/lib/utils/formating';
import { useRouter } from 'next/navigation';
import TagsSection from '../tagSection';
import { Tag } from '@/lib/definitions/backend/tag';
import DetailsManagementModal from './DetailsManagementModal';
import CreateAppointmentModal from '@/components/dashboard/CreateAppointmentSheet';
import { toast } from 'sonner';
import { Collaborator } from '@/lib/definitions/backend/collaborators';


interface SidebarProps {
    contact: ContactWithDetails;
    emails: Email[];
    phoneNumbers: PhoneNumber[];
    tags: Tag[];
    allTags: Tag[];
}


export default function Sidebar({ contact, emails, phoneNumbers, tags: initialTags, allTags }: SidebarProps) {
    const router = useRouter();

    const contactCollaborators = JSON.parse(contact.Collaborators) as Collaborator[];
    console.log('Collaborators:', contactCollaborators);


    return (

        <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="p-6">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/people')}
                    className="mb-6 flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to People
                </button>

                {/* Contact Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            {contact.FirstName[0]}
                            {contact.LastName[0]}
                        </div>
                        <DetailsManagementModal contact={contact} variant="details" />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        {contact.FirstName} {contact.LastName}
                    </h1>
                    {contact.LastContactedAt.Valid ? (
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Last contacted on {formatDate(contact.LastContactedAt.Time)}</span>
                    ) : (
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Not contacted yet</span>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mb-6 grid grid-cols-3 gap-2">
                    <button
                        className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 p-3 text-xs font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                        onClick={() => toast.success('Feature coming soon!')}
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call
                    </button>
                    <button
                        className="flex flex-col items-center gap-1 rounded-lg border border-zinc-200 p-3 text-xs font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                        onClick={() => toast.success('Feature coming soon!')}
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                    </button>
                    <CreateAppointmentModal variant="quick-action" />
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                    <div>
                        <h3 className="mb-3 text-base font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                            Contact Information
                        </h3>
                        <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                            {/* Emails */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500">
                                        Email{(emails ?? []).length > 1 ? "s" : ""}
                                    </div>

                                    {/* Add Email Button */}
                                    <DetailsManagementModal contact={contact} variant="email" emails={emails} />
                                </div>

                                {(emails ?? []).length > 0 ? (
                                    <div className="mt-1 space-y-1">
                                        {emails.map((email) => (
                                            <div key={email.id} className="flex items-center gap-2">
                                                <a
                                                    href={`mailto:${email.email_address}`}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 
                                   dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    {email.email_address}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm mt-1">No Emails</p>
                                )}
                            </div>

                            {/* Phone Numbers */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500">
                                        Phone{(phoneNumbers ?? []).length > 1 ? "s" : ""}
                                    </div>

                                    {/* Add Phone Button */}
                                    <DetailsManagementModal contact={contact} variant="phone" phones={phoneNumbers} />
                                </div>

                                {(phoneNumbers ?? []).length > 0 ? (
                                    <div className="mt-1 space-y-1">
                                        {phoneNumbers.map((phone) => (
                                            <div key={phone.id} className="flex items-center gap-2">
                                                <a
                                                    href={`tel:${phone.phone_number}`}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 
                                   dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    {formatPhoneNumber(phone.phone_number)}
                                                </a>
                                                {phone.is_primary && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-blue-100 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                    >
                                                        Primary
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm mt-1">No Phone Numbers</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500">Address</div>
                                </div>
                                {contact.Address.Valid && (
                                    <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                                        {contact.Address.String}
                                        <br />
                                        {contact.City.Valid && contact.City.String}, {contact.State.Valid && contact.State.String}{' '}
                                        {contact.ZipCode.Valid && contact.ZipCode.String}
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500">Birthdate</div>
                                </div>
                                {contact.Birthdate.Valid && contact.Birthdate.Time && (
                                    <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                        {formatDate(contact.Birthdate.Time)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>



                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                            Details
                        </h3>
                        <div className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">

                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500">Status</div>
                                </div>
                                {contact.Status.Valid && (
                                    <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                        {contact.Status.String}
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500">Source</div>
                                </div>
                                {contact.Source.Valid && (
                                    <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                        {contact.Source.String}
                                    </div>
                                )}
                            </div>
                            <div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500">Price Range</div>
                                </div>
                                <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    {contact.PriceRange.Valid ? contact.PriceRange.String : "None"}
                                </div>
                            </div>
                            <div>

                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500">Timeframe</div>
                                </div>
                                <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    {contact.Timeframe.Valid ? contact.Timeframe.String : "None"}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500">Lender</div>
                                </div>
                                <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    {contact.Lender.Valid ? contact.Lender.String : "No Lender Assigned"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                        Collaborators
                    </h3>
                    <div className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-zinc-500 dark:text-zinc-500">
                                {contactCollaborators.length === 0 ? "No Collaborators" : (
                                    <div className="mt-1 space-y-1">
                                        {contactCollaborators.map((collaborator) => (
                                            <div key={collaborator.id} className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                    {collaborator.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Add Collaborators Button */}
                            <DetailsManagementModal contact={contact} variant="collaborators" collaborators={contactCollaborators} />
                        </div>
                    </div>

                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                        Tags
                    </h3>

                    <div className="grid gap-3 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50 mb-6">

                        {/* Tags Section */}
                        <TagsSection
                            contactId={contact.ID}
                            contactTags={allTags}
                            availableTags={initialTags}
                        />
                    </div>

                    <div>
                        <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                            {contact.CreatedAt.Valid && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-500 dark:text-zinc-500">Created</span>
                                    <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                                        {formatDate(contact.CreatedAt.Time)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};
