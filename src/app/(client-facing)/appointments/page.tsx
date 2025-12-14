import { ListAllAppointments, ListUpcomingAppointments, ListTodaysAppointments } from '@/lib/data/backend/appointments';
import AppointmentsPageClient from './AppointmentsPageClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AppointmentsPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session == null) return redirect("/auth/login")
    const userId = session?.user?.id as string;

    if (!userId) {
        throw new Error('User not authenticated');
    }

    // Fetch all appointment data in parallel
    const [allAppointmentsResult, upcomingResult, todayResult] = await Promise.allSettled([
        ListAllAppointments(),
        ListUpcomingAppointments(),
        ListTodaysAppointments(),
    ]);

    const safe = (result: any) =>
        result.status === "fulfilled" && Array.isArray(result.value)
            ? result.value
            : [];

    const allAppointments = safe(allAppointmentsResult);
    const upcomingAppointments = safe(upcomingResult);
    const todayAppointments = safe(todayResult);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <AppointmentsPageClient
                allAppointments={allAppointments}
                upcomingAppointments={upcomingAppointments}
                todayAppointments={todayAppointments}
            />
        </div>
    );
}

