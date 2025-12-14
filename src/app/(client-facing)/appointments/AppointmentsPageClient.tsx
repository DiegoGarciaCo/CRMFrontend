'use client';

import CreateAppointmentModal from '@/components/dashboard/CreateAppointmentSheet';
import { Appointment } from '@/lib/definitions/backend/appointments';
import { useState, useMemo } from 'react';

interface AppointmentsPageClientProps {
    allAppointments: Appointment[];
    upcomingAppointments: Appointment[];
    todayAppointments: Appointment[];
}

type ViewMode = 'day' | 'week' | 'month';

export default function AppointmentsPageClient({
    allAppointments,
    upcomingAppointments,
    todayAppointments,
}: AppointmentsPageClientProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const getAppointmentTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'listing-appointment':
                return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700';
            case 'buyer-appointment':
                return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700';
            default:
                return 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
        }
    };

    const formatTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const formatDate = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const appointmentsByDate = useMemo(() => {
        const grouped: { [key: string]: Appointment[] } = {};

        allAppointments.forEach((appointment) => {
            const date = new Date(appointment.ScheduledAt).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(appointment);
        });

        // Sort appointments within each day by time
        Object.keys(grouped).forEach((date) => {
            grouped[date].sort((a, b) =>
                new Date(a.ScheduledAt).getTime() - new Date(b.ScheduledAt).getTime()
            );
        });

        return grouped;
    }, [allAppointments]);

    const getWeekDays = () => {
        const start = new Date(selectedDate);
        start.setDate(start.getDate() - start.getDay()); // Start from Sunday

        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            return day;
        });
    };

    const weekDays = getWeekDays();

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Appointments</h1>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        Manage your property showings and meetings
                    </p>
                </div>
                <CreateAppointmentModal variant="button" />
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Today</p>
                            <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{todayAppointments.length}</p>
                        </div>
                        <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Upcoming</p>
                            <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{upcomingAppointments.length}</p>
                        </div>
                        <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total</p>
                            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{allAppointments.length}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                            <svg className="h-6 w-6 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="mb-6 flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            const newDate = new Date(selectedDate);
                            newDate.setDate(newDate.getDate() - 7);
                            setSelectedDate(newDate);
                        }}
                        className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                        onClick={() => {
                            const newDate = new Date(selectedDate);
                            newDate.setDate(newDate.getDate() + 7);
                            setSelectedDate(newDate);
                        }}
                        className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setSelectedDate(new Date())}
                        className="ml-2 rounded-lg border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        Today
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('day')}
                        className={`rounded-lg px-3 py-1 text-sm font-medium ${viewMode === 'day'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                            }`}
                    >
                        Day
                    </button>
                    <button
                        onClick={() => setViewMode('week')}
                        className={`rounded-lg px-3 py-1 text-sm font-medium ${viewMode === 'week'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                            }`}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setViewMode('month')}
                        className={`rounded-lg px-3 py-1 text-sm font-medium ${viewMode === 'month'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                            }`}
                    >
                        Month
                    </button>
                </div>
            </div>

            {/* Week View */}
            {viewMode === 'week' && (
                <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800">
                        {weekDays.map((day) => (
                            <div
                                key={day.toISOString()}
                                className="border-r border-zinc-200 p-4 text-center last:border-r-0 dark:border-zinc-800"
                            >
                                <div className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">
                                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                                <div className={`mt-1 text-lg font-semibold ${day.toDateString() === new Date().toDateString()
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-zinc-900 dark:text-zinc-50'
                                    }`}>
                                    {day.getDate()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {weekDays.map((day) => {
                            const dayKey = day.toDateString();
                            const dayAppointments = appointmentsByDate[dayKey] || [];

                            return (
                                <div
                                    key={dayKey}
                                    className="min-h-[200px] border-r border-zinc-200 p-2 last:border-r-0 dark:border-zinc-800"
                                >
                                    <div className="space-y-2">
                                        {dayAppointments.map((appointment) => (
                                            <div
                                                key={appointment.ID}
                                                onClick={() => setSelectedAppointment(appointment)}
                                                className={`cursor-pointer rounded-lg border p-2 text-xs transition-all hover:shadow-md ${getAppointmentTypeColor(
                                                    appointment.Type.Valid ? appointment.Type.AppointmentType : 'no-type'
                                                )}`}
                                            >
                                                <div className="font-medium">{formatTime(appointment.ScheduledAt)}</div>
                                                <div className="mt-1 truncate">{appointment.Title}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Day/List View */}
            {viewMode === 'day' && (
                <div className="space-y-4">
                    {allAppointments.length === 0 ? (
                        <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                            <svg
                                className="mx-auto h-12 w-12 text-zinc-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">No appointments</h3>
                            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                Get started by creating a new appointment
                            </p>
                        </div>
                    ) : (
                        allAppointments.map((appointment) => (
                            <div
                                key={appointment.ID}
                                onClick={() => setSelectedAppointment(appointment)}
                                className="cursor-pointer rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{appointment.Title}</h3>
                                            {appointment.Type.Valid && (
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getAppointmentTypeColor(appointment.Type.AppointmentType).split(' ').slice(0, 2).join(' ')}`}>
                                                    {appointment.Type.AppointmentType.replace('-', ' ')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                                            <div className="flex items-center gap-1">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{formatDate(appointment.ScheduledAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{formatTime(appointment.ScheduledAt)}</span>
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
                                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{appointment.Note.String}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

