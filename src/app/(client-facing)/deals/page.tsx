import { GetDealsByAssignedToID } from '@/lib/data/backend/deals';
import { GetAllStages } from '@/lib/data/backend/stages';
import DealsPageClient from './DealsPageClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Stage } from '@/lib/definitions/backend/stage';

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session == null) return redirect("/auth/login")
    const userId = session?.user?.id as string;

    if (!userId) {
        throw new Error('User not authenticated');
    }

    // Fetch data in parallel
    const [dealsResult, stagesResult] = await Promise.allSettled([
        GetDealsByAssignedToID(userId),
        GetAllStages(userId),
    ]);

    const safe = (result: any) =>
        result.status === "fulfilled" && Array.isArray(result.value)
            ? result.value
            : [];

    console.log("Deals Result:", dealsResult);
    const deals = safe(dealsResult);
    console.log("Deals:", deals);
    const stages = safe(stagesResult);

    // Sort stages by OrderIndex
    const sortedStages = stages.sort((a: Stage, b: Stage) => a.OrderIndex - b.OrderIndex);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <DealsPageClient deals={deals} stages={sortedStages} userId={userId} />
        </div>
    );
}

