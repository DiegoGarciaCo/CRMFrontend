import StatCard from '@/components/dashboard/StatCard';
import RecentContacts from '@/components/dashboard/RecentContacts';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import TaskList from '@/components/dashboard/TaskList';
import { GetDashboardContacts, GetAppointmentCount, GetTaskCount, GetNewContactsCount, GetContactsCount } from '@/lib/data/backend/dashboard';
import { ListUpcomingAppointments } from '@/lib/data/backend/appointments';
import { GetTasksDueToday } from '@/lib/data/backend/task';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import CreateContactSheet from '@/components/dashboard/CreateContactSheet';
import CreateAppointmentSheet from '@/components/dashboard/CreateAppointmentSheet';
import CreateTaskSheet from '@/components/dashboard/CreateTaskSheet';
import CreateNoteSheet from '@/components/dashboard/CreateNoteSheet';

// This is a server component that fetches data
export default async function Dashboard() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session == null) return redirect("/auth/login")
    const userId = session?.user?.id as string;

    if (!userId) {
        throw new Error('User not authenticated');
    }

    // Fetch all dashboard data in parallel
    const [
        recentContacts,
        appointmentCount,
        taskCount,
        newContactsCount,
        upcomingAppointments,
        todaysTasks,
        totalContacts,
    ] = await Promise.allSettled([
        GetDashboardContacts(),
        GetAppointmentCount(),
        GetTaskCount(),
        GetNewContactsCount(),
        ListUpcomingAppointments(),
        GetTasksDueToday(),
        GetContactsCount(),
    ]);

    // Extract data or use fallbacks
    const contacts = recentContacts.status === 'fulfilled' ? recentContacts.value : [];
    const appointmentsCount = appointmentCount.status === 'fulfilled' ? appointmentCount.value : 0;
    const tasksCount = taskCount.status === 'fulfilled' ? taskCount.value : 0;
    const newContacts = newContactsCount.status === 'fulfilled' ? newContactsCount.value : 0;
    const contactsCount = totalContacts.status === 'fulfilled' ? totalContacts.value : 0;
    const appointments = upcomingAppointments.status === 'fulfilled' ? upcomingAppointments.value : [];
    const tasks = todaysTasks.status === 'fulfilled' ? todaysTasks.value : [];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        Welcome back, {session.user.name.split(" ")[0]}! Here&apos;s what&apos;s happening today.
                    </p>
                </div>
                {/* Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="New Contacts"
                        value={newContacts}
                        description="This month"
                        icon={
                            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        }
                        trend={{ value: 12, direction: 'up' }}
                    />
                    <StatCard
                        title="Upcoming Appointments"
                        value={appointmentsCount}
                        description="Next 7 days"
                        icon={
                            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Tasks Today"
                        value={tasksCount}
                        description="Pending completion"
                        icon={
                            <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Active Contacts"
                        value={contactsCount}
                        description="Total in pipeline"
                        icon={
                            <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                    />
                </div>

                {/* Main Grid */}
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    {/* Recent Contacts */}
                    <RecentContacts contacts={contacts} />

                    {/* Upcoming Appointments */}
                    <UpcomingAppointments appointments={appointments} />
                </div>

                {/* Tasks Section */}
                <div className="mt-6">
                    <TaskList tasks={tasks} />
                </div>

                {/* Quick Actions */}
                <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Quick Actions</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <CreateContactSheet />
                        <CreateAppointmentSheet ownerId={userId} />
                        <CreateTaskSheet ownerId={userId} />
                        <CreateNoteSheet ownerId={userId} />
                    </div>
                </div>
            </main>
        </div>
    );
}
