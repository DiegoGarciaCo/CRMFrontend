"use client";

import { Appointment } from "@/lib/definitions/backend/appointments";
import { Deal } from "@/lib/definitions/backend/deals";
import { Task } from "@/lib/definitions/backend/tasks";
import { Badge } from "@/components/ui/badge";
import CreateTaskModal from "@/components/dashboard/CreateTaskSheet";
import CreateAppointmentModal from "@/components/dashboard/CreateAppointmentSheet";
import CreateDealModal from "@/components/deals/CreateDealSheet";
import { Stage } from "@/lib/definitions/backend/stage";
import { Table, TableBody } from "@/components/ui/table";
import EditTaskModal from "@/components/tasks/UpdateTaskModal";
import EditAppointmentModal from "@/components/appointments/EditAppointmentModal";
import { EditDealModal } from "@/components/deals/EditDealModal";

interface RightSidebarProps {
    deals: Deal[];
    appointments: Appointment[];
    tasks: Task[];
    stages: Stage[];
    contactId: string;
}
export default function RightSidebar({ deals, appointments, tasks, stages, contactId }: RightSidebarProps) {

    const dealStages = stages.map(stage => ({
        id: stage.ID,
        name: stage.Name,
    }));



    return (
        <div className="w-90 flex-shrink-0 flex flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
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
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                        Appointments ({appointments.length})
                    </h3>
                    <CreateAppointmentModal variant="plus" contactId={contactId} />
                </div>

                <div>
                    {appointments.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-8">
                            No appointments yet
                        </p>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 h-full">
                            <Table>
                                <TableBody>
                                    {appointments.map((appointment) => (
                                        <EditAppointmentModal
                                            key={appointment.ID}
                                            appointment={appointment}
                                            variant="table-cell"
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>

            {/* Deals */}
            <div className="flex-1 overflow-y-auto border-b border-zinc-200 dark:border-zinc-800">
                <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                        Deals ({deals.length})
                    </h3>
                    <CreateDealModal variant="plus" stages={stages} contactId={contactId} />
                </div>

                <div>
                    {deals.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-8">
                            No deals yet
                        </p>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 h-full">
                            <Table>
                                <TableBody>
                                    {deals.map((deal) => (
                                        <EditDealModal
                                            key={deal.ID}
                                            deal={deal}
                                            stages={dealStages}
                                            variant="table-cell"
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
