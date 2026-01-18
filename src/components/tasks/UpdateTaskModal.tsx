'use client';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Task } from "@/lib/definitions/backend/tasks";
import { useState } from "react";
import UpdateTaskForm from "@/components/tasks/UpdateTaskForm";
import { FormatDateTimeForInput } from "@/lib/utils/formating";
import {
    getPriorityColor,
    getPriorityBadgeColor,
    getStatusColor,
    getTaskTypeIcon,
} from "@/lib/utils/taskHelpers";
import { TableCell, TableRow } from "../ui/table";

interface EditTaskModalProps {
    variant: "card" | "table-cell";
    task: Task;
}

export default function EditTaskModal({ variant, task }: EditTaskModalProps) {
    const [open, setOpen] = useState(false);

    const formatedDate = FormatDateTimeForInput(new Date(task.Date.Valid ? task.Date.Time : new Date()));
    const time = formatedDate.split(' ')[1] + ` ${formatedDate.split(' ')[2]}`;

    const renderTrigger = () => {

        switch (variant) {
            case "card":
                return (
                    <div
                        className={`capitalize cursor-pointer rounded-lg border-l-4 p-4 shadow-sm transition-all hover:shadow-md ${getPriorityColor(
                            task.Priority.Valid ? task.Priority.TaskPriority : 'normal'
                        )}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {task.Type.Valid && (
                                            <div className="text-zinc-400">
                                                {getTaskTypeIcon(task.Type.TaskType)}
                                            </div>
                                        )}
                                        <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                                            {task.Title}
                                        </h3>
                                    </div>

                                    {task.Date.Valid && new Date(task.Date.Time).getTime() < Date.now() && (
                                        <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                                            Past Due
                                        </div>
                                    )}
                                </div>

                                {task.Note.Valid && task.Note.String && (
                                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                        {task.Note.String}
                                    </p>
                                )}

                                <div className="mt-3 flex justify-between items-center w-full">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {task.Priority.Valid && (
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityBadgeColor(task.Priority.TaskPriority)}`}>
                                                {task.Priority.TaskPriority}
                                            </span>
                                        )}
                                        {task.Status.Valid && (
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(task.Status.TaskStatus)}`}>
                                                {task.Status.TaskStatus}
                                            </span>
                                        )}
                                        {task.Type.Valid && (
                                            <span className="text-xs text-zinc-500 dark:text-zinc-500">
                                                {task.Type.TaskType.replace('-', ' ')}
                                            </span>
                                        )}
                                    </div>

                                    {task.Date.Valid && (
                                        <div
                                            className={`text-xs font-medium ${new Date(task.Date.Time).getTime() < Date.now() ? "text-red-600 dark:text-red-400"
                                                : "text-zinc-900 dark:text-zinc-50"
                                                }`}
                                        >
                                            {FormatDateTimeForInput(new Date(task.Date.Time))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "table-cell":
                const isLate =
                    task.Date.Valid && new Date(task.Date.Time).getTime() < Date.now();

                return (
                    <TableRow
                        key={task.ID}
                        className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                        {/* Task + Note */}
                        <TableCell>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 text-zinc-400 dark:text-zinc-500">
                                    {task.Type.Valid && getTaskTypeIcon(task.Type.TaskType)}
                                </div>

                                <div>
                                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                                        {task.Title}
                                    </div>

                                    {task.Note.Valid && task.Note.String && (
                                        <div className="text-sm text-zinc-500">
                                            {task.Note.String}
                                        </div>
                                    )}

                                    {isLate && (
                                        <div className="text-xs font-semibold text-red-600 dark:text-red-400">
                                            Past Due
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TableCell>

                        {/* Priority */}
                        <TableCell>
                            {task.Priority.Valid && (
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(
                                        task.Priority.TaskPriority
                                    )}`}
                                >
                                    {task.Priority.TaskPriority}
                                </span>
                            )}
                        </TableCell>

                        {/* Type */}
                        <TableCell className="capitalize">
                            {task.Type.Valid ? task.Type.TaskType.replace("-", " ") : "—"}
                        </TableCell>

                        {/* Due Time */}
                        <TableCell>
                            {task.Date.Valid ? time : "—"}
                        </TableCell>
                    </TableRow>
                );

            default:
                return <button>Edit Task</button>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {renderTrigger()}
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>
                        Update the details of this task.
                    </DialogDescription>
                </DialogHeader>

                <UpdateTaskForm task={task} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
