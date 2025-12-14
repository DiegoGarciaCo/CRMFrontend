import { GetDealsByAssignedToID } from '@/lib/data/backend/deals';
import DealsPageClient from './DealsPageClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { GetStagesByClientType } from '@/lib/data/backend/stages';

export const dynamic = 'force-dynamic';

export default async function DealsPage({
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

    const clientTypeParam = await searchParams
        .then(params => {
            const src = params['client-type'];
            if (Array.isArray(src)) {
                return src[0];
            }
            if (src === undefined) {
                return "buyer";
            }
            return src;
        })
        .catch(() => { return "buyer"; });

    const clientType = clientTypeParam === "seller" ? "seller" : "buyer";

    // Fetch data in parallel
    const [dealsResult, stagesResult] = await Promise.allSettled([
        GetDealsByAssignedToID(),
        GetStagesByClientType(clientType),
    ]);

    const safe = (result: any) =>
        result.status === "fulfilled" && Array.isArray(result.value)
            ? result.value
            : [];

    const deals = safe(dealsResult);
    const stages = safe(stagesResult);


    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <DealsPageClient deals={deals} clientType={clientType} stages={stages} />
        </div>
    );
}

