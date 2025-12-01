import { GetGoalsByUserIDAndYear } from '@/lib/data/backend/goals';
import { GetDealsByAssignedToID } from '@/lib/data/backend/deals';
import GoalsPageClient from './GoalsPageClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Goal } from '@/lib/definitions/backend/goals';

export const dynamic = 'force-dynamic';

export default async function GoalsPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session == null) return redirect("/auth/login")
    const userId = session?.user?.id as string;

    if (!userId) {
        throw new Error('User not authenticated');
    }
    const currentYear = new Date().getFullYear();

    // Fetch data in parallel
    const [goalsResult, dealsResult] = await Promise.allSettled([
        GetGoalsByUserIDAndYear(userId, currentYear),
        GetDealsByAssignedToID(userId),
    ]);

    const safe = (result: any) =>
        result.status === "fulfilled" && Array.isArray(result.value)
            ? result.value
            : [];


    const goal = goalsResult.status === 'fulfilled' ? goalsResult?.value : undefined;
    const deals = safe(dealsResult);

    // Debug logging
    if (goalsResult.status === 'rejected') {
        console.error('Failed to fetch goals:', goalsResult.reason);
    }
    if (dealsResult.status === 'rejected') {
        console.error('Failed to fetch deals:', dealsResult.reason);
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <GoalsPageClient goal={goal as Goal | undefined} deals={deals} userId={userId} />
        </div>
    );
}

