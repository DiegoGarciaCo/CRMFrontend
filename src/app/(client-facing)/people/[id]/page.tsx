import { GetContactByID } from '@/lib/data/backend/contacts';
import { GetContactNotesByContactID } from '@/lib/data/backend/notes';
import { GetContactLogByID } from '@/lib/data/backend/contactLogs';
import { GetAllTags } from '@/lib/data/backend/tags';
import ContactDetailClient from './ContactDetailClient';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

interface ContactPageProps {
    params: Promise<{ id: string }>;
}

export default async function ContactDetailPage({ params }: ContactPageProps) {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id as string;

    // Fetch all data in parallel
    const [contactResult, notesResult, logsResult, tagsResult] = await Promise.allSettled([
        GetContactByID(id),
        GetContactNotesByContactID(id),
        GetContactLogByID(id),
        GetAllTags(),
    ]);

    if (contactResult.status === 'rejected') {
        notFound();
    }

    const safe = (result: any) =>
        result.status === "fulfilled" && Array.isArray(result.value)
            ? result.value
            : [];

    const contact = contactResult.value;
    const notes = safe(notesResult);
    const logs = safe(logsResult);
    const tags = safe(tagsResult);
    const contactTags = JSON.parse(contact.Tags);

    const emails = JSON.parse(contact.Emails)
    const phoneNumbers = JSON.parse(contact.PhoneNumbers)

    return (
        <ContactDetailClient
            contact={contact}
            notes={notes}
            logs={logs}
            emails={emails}
            phoneNumbers={phoneNumbers}
            tags={tags}
            allTags={contactTags}
            userId={userId}
        />
    );
}
