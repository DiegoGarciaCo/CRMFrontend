import { Appointment } from '@/lib/definitions/backend/appointments';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import EditAppointmentModal from '../appointments/EditAppointmentModal';

interface UpcomingAppointmentsProps {
    appointments: Appointment[];
}

export default function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {

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
