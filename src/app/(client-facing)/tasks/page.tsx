import { GetTasksByAssignedToID, GetLateTasks, GetTasksDueToday } from '@/lib/data/backend/task';
import TasksPageClient from './TasksPageClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TasksPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth.api.getSession({ headers: await headers() })

    const selectedTabParam = await searchParams
        .then(params => {
            const src = params['tab'];
            if (Array.isArray(src)) {
                return src[0];
            }
            if (src === undefined) {
                return "all";
            }
            return src;
        })
        .catch(() => { return "all"; });

    type SelectedTab = "all" | "late" | "today";

    const selectedTab: SelectedTab =
        selectedTabParam === "late"
            ? "late"
            : selectedTabParam === "today"
                ? "today"
                : "all";


    if (session == null) return redirect("/auth/login")
    const userId = session?.user?.id as string;

    if (!userId) {
        throw new Error('User not authenticated');
    }

    // Fetch all task data in parallel
    const [allTasksResult, lateTasksResult, todayTasksResult] = await Promise.allSettled([
        GetTasksByAssignedToID(),
        GetLateTasks(),
        GetTasksDueToday(),
    ]);

    const safe = (result: any) =>
        result.status === "fulfilled" && Array.isArray(result.value)
            ? result.value
            : [];

    const allTasks = safe(allTasksResult);
    const lateTasks = safe(lateTasksResult);
    const todayTasks = safe(todayTasksResult);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <TasksPageClient
                allTasks={allTasks}
                lateTasks={lateTasks}
                todayTasks={todayTasks}
                selectedTab={selectedTab}
            />
        </div>
    );
}

