import { GetDealsByAssignedToID } from '@/lib/data/backend/deals';
import DealsPageClient from './DealsPageClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session == null) return redirect("/auth/login")
    const userId = session?.user?.id as string;

    if (!userId) {
        throw new Error('User not authenticated');
    }

    // Fetch data in parallel
    const [dealsResult] = await Promise.allSettled([
        GetDealsByAssignedToID(),
    ]);

    const safe = (result: any) =>
        result.status === "fulfilled" && Array.isArray(result.value)
            ? result.value
            : [];

    const deals = safe(dealsResult);


    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <DealsPageClient deals={deals} userId={userId} />
        </div>
    );
}

