import { Appointment } from '@/lib/definitions/backend/appointments';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import EditAppointmentModal from '../appointments/EditAppointmentModal';

interface UpcomingAppointmentsProps {
    appointments: Appointment[];
}

export default function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
    const getAppointmentTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "listing-appointment":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "buyer-appointment":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            default:
                return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let label = "";
        if (date.toDateString() === today.toDateString()) label = "Today";
        else if (date.toDateString() === tomorrow.toDateString()) label = "Tomorrow";
        else label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

        const time = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });

        return { date: label, time };
    };

    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                <Link
                    href="/appointments"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    View Calendar
                </Link>
            </div>

            {appointments.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">
                    No upcoming appointments
                </p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.map((a) => (
                            <EditAppointmentModal key={a.ID} appointment={a} variant="table-cell" />
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
