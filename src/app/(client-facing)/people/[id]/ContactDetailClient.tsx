'use client';

import { ContactWithDetails } from '@/lib/definitions/backend/contacts';
import { ContactNote } from '@/lib/definitions/backend/notes';
import { ContactLog } from '@/lib/definitions/backend/contactLogs';
import { Email } from '@/lib/definitions/backend/emails';
import { PhoneNumber } from '@/lib/definitions/backend/phoneNumbers';
import { Deal } from '@/lib/definitions/backend/deals';
import { Appointment } from '@/lib/definitions/backend/appointments';
import { Task } from '@/lib/definitions/backend/tasks';
import Sidebar from '@/components/people/id/sidebar';
import RightSidebar from '@/components/people/id/rightSidebar';
import { Tag } from '@/lib/definitions/backend/tag';
import { Stage } from '@/lib/definitions/backend/stage';
import LogNoteCreation from '@/components/people/id/notesLogs';


interface ContactDetailClientProps {
    contact: ContactWithDetails;
    notes: ContactNote[];
    logs: ContactLog[];
    emails: Email[];
    phoneNumbers: PhoneNumber[];
    tags: Tag[];
    allTags: Tag[];
    deals: Deal[];
    appointments: Appointment[];
    tasks: Task[];
    stages: Stage[];
}

export default function ContactDetailClient(props: ContactDetailClientProps) {
    const { contact, notes, logs, emails, phoneNumbers, tags: initialTags, allTags, stages } = props;

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950">
            {/* Left Sidebar - Contact Info */}
            <Sidebar
                contact={contact}
                emails={emails}
                phoneNumbers={phoneNumbers}
                tags={initialTags}
                allTags={allTags}
            />

            {/* Main Content - Notes & Logs */}
            <LogNoteCreation
                contact={contact}
                notes={notes}
                logs={logs}
            />

            {/* Right Sidebar - Tasks, Appointments, Deals */}
            <RightSidebar
                deals={props.deals}
                appointments={props.appointments}
                tasks={props.tasks}
                stages={stages}
            />
        </div>
    );
}
