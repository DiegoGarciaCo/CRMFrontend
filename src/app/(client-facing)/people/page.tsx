import { GetAllContacts } from '@/lib/data/backend/contacts';
import { GetAllSmartLists } from '@/lib/data/backend/smartLists';
import PeoplePageClient from './PeoplePageClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { GetAllTags } from '@/lib/data/backend/tags';

export const dynamic = 'force-dynamic';

export default async function PeoplePage() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (session == null) return redirect("/auth/login")
    const userId = session?.user?.id as string;

    if (!userId) {
        throw new Error('User not authenticated');
    }

    // Fetch data in parallel
    const [contactsResult, smartListsResult, tagsResult] = await Promise.allSettled([
        GetAllContacts(),
        GetAllSmartLists(),
        GetAllTags(),
    ]);

    const safe = (result: any) =>
        result.status === "fulfilled" && Array.isArray(result.value)
            ? result.value
            : [];

    const contacts = safe(contactsResult);
    const smartLists = safe(smartListsResult);
    const tags = safe(tagsResult);


    return (
        <div className="flex h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950">
            <PeoplePageClient
                userId={userId}
                initialContacts={contacts}
                smartLists={smartLists}
                tags={tags}
            />
        </div>
    );
}

