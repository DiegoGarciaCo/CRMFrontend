import { Task } from '@/lib/definitions/backend/tasks';
import Link from 'next/link';

interface TaskListProps {
    tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
    console.log('Tasks:', tasks);
    const getPriorityColor = (priority: string) => {
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

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Today&apos;s Tasks</h2>
                <Link
                    href="/tasks"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    View All
                </Link>
            </div>
            <div className="space-y-3">
                {(tasks ?? []).length === 0 ? (
                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-500 py-8">No tasks due today</p>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.ID}
                            className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                        >
                            <div className="mt-0.5 text-zinc-400 dark:text-zinc-500">
                                {task.Type.Valid && getTaskTypeIcon(task.Type.TaskType)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{task.Title}</h3>
                                        {task.Note.Valid && task.Note.String && (
                                            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{task.Note.String}</p>
                                        )}
                                    </div>
                                    {task.Priority.Valid && (
                                        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(task.Priority.TaskPriority)}`}>
                                            {task.Priority.TaskPriority}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-500">
                                    {task.Type.Valid && (
                                        <span className="capitalize">{task.Type.TaskType.replace('-', ' ')}</span>
                                    )}
                                    {task.Date.Valid && (
                                        <span>{formatTime(task.Date.Time)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

