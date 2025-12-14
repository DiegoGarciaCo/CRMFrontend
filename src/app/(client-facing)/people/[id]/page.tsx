import { GetContactByID } from '@/lib/data/backend/contacts';
import { GetContactNotesByContactID } from '@/lib/data/backend/notes';
import { GetContactLogByID } from '@/lib/data/backend/contactLogs';
import { GetAllTags } from '@/lib/data/backend/tags';
import ContactDetailClient from './ContactDetailClient';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { GetDealsByContactID } from '@/lib/data/backend/deals';
import { ListAppointmentsByContactID } from '@/lib/data/backend/appointments';
import { GetTasksByContactID } from '@/lib/data/backend/task';
import { GetAllStages } from '@/lib/data/backend/stages';

export const dynamic = 'force-dynamic';

interface ContactPageProps {
    params: Promise<{ id: string }>;
}

export default async function ContactDetailPage({ params }: ContactPageProps) {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id as string;

    if (!userId) {
        redirect('/auth/login');
    }


    // Fetch all data in parallel
    const [contactResult, notesResult, logsResult, tagsResult, dealsResult, appointmentsResults, taskResults, stagesResults] = await Promise.allSettled([
        GetContactByID(id),
        GetContactNotesByContactID(id),
        GetContactLogByID(id),
        GetAllTags(),
        GetDealsByContactID(id),
        ListAppointmentsByContactID(id),
        GetTasksByContactID(id),
        GetAllStages(),
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
    const deals = safe(dealsResult);
    const appointments = safe(appointmentsResults);
    const tasks = safe(taskResults);
    const stages = safe(stagesResults);

    const emails = JSON.parse(contact.Emails)
    const phoneNumbers = JSON.parse(contact.PhoneNumbers)
    const contactTags = JSON.parse(contact.Tags).map((tag: any) => {
        return {
            ID: tag.id,
            Name: tag.name,
            UserID: tag.user_id,
            Description: { String: tag.description, Valid: tag.description ? true : false },
            CreatedAt: { Time: tag.created_at, Valid: tag.created_at ? true : false },
            UpdatedAt: { Time: tag.updated_at, Valid: tag.updated_at ? true : false },
        }
    });

    console.log("Contact Tags:", contactTags);
    console.log("All Tags:", tags);


    return (
        <ContactDetailClient
            contact={contact}
            notes={notes}
            logs={logs}
            emails={emails}
            phoneNumbers={phoneNumbers}
            tags={tags}
            allTags={contactTags}
            deals={deals}
            appointments={appointments}
            tasks={tasks}
            stages={stages}
        />
    );
}
