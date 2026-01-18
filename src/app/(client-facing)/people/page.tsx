import { GetAllContacts, GetContactsBySmartListID } from '@/lib/data/backend/contacts';
import { GetAllSmartLists } from '@/lib/data/backend/smartLists';
import PeoplePageClient from './PeoplePageClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { GetAllTags } from '@/lib/data/backend/tags';

export const dynamic = 'force-dynamic';

export default async function PeoplePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (session == null) return redirect("/auth/login")
    const userId = session?.user?.id as string;

    if (!userId) {
        throw new Error('User not authenticated');
    }

    const contactLimit = await searchParams
        .then(params => {
            const src = params['limit'];
            if (Array.isArray(src)) {
                return "25";
            }
            if (src === undefined) {
                return "25";
            }
            return src;
        })
        .catch(() => { return "25"; });

    const contactOffset = await searchParams
        .then(params => {
            const src = params['offset'];
            if (Array.isArray(src)) {
                return "0";
            }
            if (src === undefined) {
                return "0";
            }
            return src;
        })
        .catch(() => { return "0" });

    const listID = await searchParams
        .then(params => {
            const src = params['list'];
            if (Array.isArray(src)) {
                return undefined;
            }
            if (src === undefined) {
                return undefined;
            }
            return src;
        })
        .catch(() => { return undefined; });

    // Fetch data in parallel
    const [contactsResult, smartListsResult, tagsResult] = await Promise.allSettled([
        GetAllContacts(contactLimit, contactOffset),
        GetAllSmartLists(),
        GetAllTags(),
    ]);

    const safe = (result: any) =>
        result.status === "fulfilled" && Array.isArray(result.value)
            ? result.value
            : [];

    const smartLists = safe(smartListsResult);
    const tags = safe(tagsResult);

    let contacts = [];
    if (listID != undefined) {
        contacts = await GetContactsBySmartListID(listID, contactLimit, contactOffset);
    } else {
        contacts = safe(contactsResult);
    }
    console.log("Contacts fetched:", contacts);

    return (
        <div className="h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            <PeoplePageClient
                userId={userId}
                limit={contactLimit}
                offset={contactOffset}
                activeListId={listID || null}
                contacts={contacts}
                smartLists={smartLists}
                tags={tags}
            />
        </div>
    );
}

