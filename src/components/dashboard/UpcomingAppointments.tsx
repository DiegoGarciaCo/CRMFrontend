import { Appointment } from '@/lib/definitions/backend/appointments';
import Link from 'next/link';

interface UpcomingAppointmentsProps {
    appointments: Appointment[];
}

export default function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
    const getAppointmentTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'listing-appointment':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'buyer-appointment':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            default:
                return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
        }
    };

    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let dateLabel = '';
        if (date.toDateString() === today.toDateString()) {
            dateLabel = 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            dateLabel = 'Tomorrow';
        } else {
            dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        return { date: dateLabel, time };
    };

    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Upcoming Appointments</h2>
                <Link
                    href="/appointments"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    View Calendar
                </Link>
            </div>
            <div className="space-y-3">
                {(appointments ?? []).length === 0 ? (
                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-500 py-8">No upcoming appointments</p>
                ) : (
                    appointments.map((appointment) => {
                        const { date, time } = formatDateTime(appointment.ScheduledAt);
                        return (
                            <div
                                key={appointment.ID}
                                className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{appointment.Title}</h3>
                                            {appointment.Type.Valid && (
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getAppointmentTypeColor(appointment.Type.AppointmentType)}`}>
                                                    {appointment.Type.AppointmentType.replace('-', ' ')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                                            <div className="flex items-center gap-1">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{date}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{time}</span>
                                            </div>
                                            {appointment.Location.Valid && (
                                                <div className="flex items-center gap-1">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{appointment.Location.String}</span>
                                                </div>
                                            )}
                                        </div>
                                        {appointment.Note.Valid && appointment.Note.String && (
                                            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{appointment.Note.String}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

