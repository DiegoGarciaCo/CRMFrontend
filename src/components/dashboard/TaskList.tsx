"use client";

import { Task } from "@/lib/definitions/backend/tasks";
import Link from "next/link";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import EditTaskModal from "../tasks/UpdateTaskModal";

interface TaskListProps {
    tasks: Task[];
}

export default function TodayTasksTable({ tasks }: TaskListProps) {


    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    Today&apos;s Tasks
                </h2>
                <Link
                    href="/tasks"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    View All
                </Link>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Due</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {tasks.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                                No tasks due today
                            </TableCell>
                        </TableRow>
                    ) : (
                        tasks.map((task) => <EditTaskModal key={task.ID} task={task} variant="table-cell" />)
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
