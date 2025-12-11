import { GetGoalsByUserIDAndYear } from '@/lib/data/backend/goals';
import { GetDealsByAssignedToID } from '@/lib/data/backend/deals';
import GoalsPageClient from './GoalsPageClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Goal } from '@/lib/definitions/backend/goals';

export const dynamic = 'force-dynamic';

export default async function GoalsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session == null) return redirect("/auth/login");

    const userId = session?.user?.id as string;
    if (!userId) {
        throw new Error('User not authenticated');
    }

    const currentYear = new Date().getFullYear();

    const yearParam = await searchParams
        .then(params => {
            const src = params['year'];
            if (Array.isArray(src)) {
                return src[0];
            }
            if (src === undefined) {
                return currentYear.toString();
            }
            return src;
        })
        .catch(() => { return currentYear.toString(); });

    const selectedYear = yearParam ? parseInt(yearParam, 10) : currentYear;

    // Validate year (reasonable range: 2000 to current year + 5)
    const validYear = !isNaN(selectedYear) && selectedYear >= 2000 && selectedYear <= currentYear + 5
        ? selectedYear
        : currentYear;

    // Fetch data in parallel for the selected year
    const [goalsResult, dealsResult] = await Promise.allSettled([
        GetGoalsByUserIDAndYear(validYear),
        GetDealsByAssignedToID(),
    ]);

    const safe = (result: any) =>
        result.status === "fulfilled" && Array.isArray(result.value)
            ? result.value
            : [];

    const goal = goalsResult.status === 'fulfilled' ? goalsResult?.value : undefined;
    const deals = safe(dealsResult);


    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <GoalsPageClient
                goal={goal as Goal | undefined}
                deals={deals}
                selectedYear={validYear}
                currentYear={currentYear}
            />
        </div>
    );
}
