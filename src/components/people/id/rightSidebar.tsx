"use client";

import { Appointment } from "@/lib/definitions/backend/appointments";
import { Deal } from "@/lib/definitions/backend/deals";
import { Task } from "@/lib/definitions/backend/tasks";
import { Badge } from "@/components/ui/badge";
import CreateTaskModal from "@/components/dashboard/CreateTaskSheet";
import CreateAppointmentModal from "@/components/dashboard/CreateAppointmentSheet";
import CreateDealModal from "@/components/deals/CreateDealSheet";
import { Stage } from "@/lib/definitions/backend/stage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EditTaskModal from "@/components/tasks/UpdateTaskModal";

interface RightSidebarProps {
    deals: Deal[];
    appointments: Appointment[];
    tasks: Task[];
    stages: Stage[];
    contactId: string;
}
export default function RightSidebar({ deals, appointments, tasks, stages, contactId }: RightSidebarProps) {


    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const formatDateShort = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });


    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'normal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'low': return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400';
            default: return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400';
        }
    };

    return (
        <div className="w-100 flex-shrink-0 flex flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            {/* Tasks */}
            <div className="flex-1 overflow-y-auto border-b border-zinc-200 dark:border-zinc-800">
                <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                        Tasks ({tasks.length})
                    </h3>
                    <CreateTaskModal variant="plus" contactId={contactId} />
                </div>

                <div>
                    {tasks.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-8">
                            No tasks yet
                        </p>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 h-full">
                            <Table>

                                <TableBody>
                                    {tasks.map((task) => (
                                        <EditTaskModal
                                            key={task.ID}
                                            task={task}
                                            variant="table-cell"
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>

            {/* Appointments */}
            <div className="flex-1 overflow-y-auto border-b border-zinc-200 dark:border-zinc-800">
                <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Appointments ({appointments.length})</h3>
                    <CreateAppointmentModal variant="plus" contactId={contactId} />
                </div>
                <div className="p-4 space-y-3">
                    {appointments.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-8">No appointments yet</p>
                    ) : (
                        appointments.map(apt => (
                            <div key={apt.ID} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                                <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-50 mb-1">{apt.Title}</h4>
                                {apt.Type.Valid && <Badge variant="outline" className="text-xs mb-2">{apt.Type.AppointmentType}</Badge>}
                                <p className="text-xs text-zinc-600 dark:text-zinc-400">{formatDate(apt.ScheduledAt)}</p>
                                {apt.Location.Valid && <p className="text-xs text-zinc-500 mt-1">{apt.Location.String}</p>}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Deals */}
            <div className="flex-1 overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Deals ({deals.length})</h3>
                    <CreateDealModal variant="plus" stages={stages} contactId={contactId} />
                </div>
                <div className="p-4 space-y-3">
                    {deals.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-8">No deals yet</p>
                    ) : (
                        deals.map(deal => (
                            <div key={deal.ID} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                                <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-50 mb-1">{deal.Title}</h4>
                                <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">${deal.Price.toLocaleString()}</p>
                                {deal.PropertyAddress.Valid && <p className="text-xs text-zinc-600 dark:text-zinc-400">{deal.PropertyAddress.String}</p>}
                                {deal.ClosingDate.Valid && <p className="text-xs text-zinc-500 mt-1">Closing: {formatDateShort(deal.ClosingDate.Time)}</p>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
