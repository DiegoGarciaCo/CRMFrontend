'use client';

import { Task } from '@/lib/definitions/backend/tasks';
import { FormatDateTimeForInput } from '@/lib/utils/formating';

interface TaskCardProps {
    task: Task;
    onClick: (task: Task) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
            case 'normal':
                return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
            case 'low':
                return 'border-l-green-500 bg-green-50 dark:bg-green-900/10';
            default:
                return 'border-l-zinc-300 bg-white dark:bg-zinc-900';
        }
    };

    const getPriorityBadgeColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'normal':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'low':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            default:
                return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'pending':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'cancelled':
                return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
            default:
                return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
        }
    };

    const getTaskTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'call':
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                );
            case 'email':
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                );
            case 'follow-up':
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
            case 'showing':
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                );
        }
    };

    return (
        <div
            onClick={() => onClick(task)}
            className={`cursor-pointer rounded-lg border-l-4 p-4 shadow-sm transition-all hover:shadow-md ${getPriorityColor(
                task.Priority.Valid ? task.Priority.TaskPriority : 'normal'
            )}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        {task.Type.Valid && (
                            <div className="text-zinc-400">{getTaskTypeIcon(task.Type.TaskType)}</div>
                        )}
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{task.Title}</h3>
                    </div>

                    {task.Note.Valid && task.Note.String && (
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{task.Note.String}</p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
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
                </div>

                {task.Date.Valid && (
                    <div className="ml-4 text-right">
                        <div className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                            {FormatDateTimeForInput(new Date(task.Date.Time))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

