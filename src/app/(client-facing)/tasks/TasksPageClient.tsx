'use client';

import { Task } from '@/lib/definitions/backend/tasks';
import { useState, useMemo } from 'react';
import TaskCard from '@/components/tasks/TaskCard';
import CreateTaskModal from '@/components/dashboard/CreateTaskSheet';

interface TasksPageClientProps {
    allTasks: Task[];
    lateTasks: Task[];
    todayTasks: Task[];
}

type FilterStatus = 'all' | 'pending' | 'completed' | 'cancelled';
type FilterPriority = 'all' | 'high' | 'normal' | 'low';

export default function TasksPageClient({ allTasks, lateTasks, todayTasks }: TasksPageClientProps) {
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const filteredTasks = useMemo(() => {
        return allTasks.filter((task) => {
            // Status filter
            if (filterStatus !== 'all' && task.Status.Valid) {
                if (task.Status.TaskStatus !== filterStatus) return false;
            }

            // Priority filter
            if (filterPriority !== 'all' && task.Priority.Valid) {
                if (task.Priority.TaskPriority !== filterPriority) return false;
            }

            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const titleMatch = task.Title.toLowerCase().includes(searchLower);
                const noteMatch = task.Note.Valid && task.Note.String.toLowerCase().includes(searchLower);
                if (!titleMatch && !noteMatch) return false;
            }

            return true;
        });
    }, [allTasks, filterStatus, filterPriority, searchTerm]);

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Tasks</h1>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Manage and track your follow-ups and activities
                </p>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Late Tasks</p>
                            <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{lateTasks.length}</p>
                        </div>
                        <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
                            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Due Today</p>
                            <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{todayTasks.length}</p>
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
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Tasks</p>
                            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{allTasks.length}</p>
                        </div>
                        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                            <svg className="h-6 w-6 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <svg
                        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                {/* Priority Filter */}
                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                </select>

                {/* Add Task Button */}
                <CreateTaskModal variant="button" />
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                Showing {filteredTasks.length} of {allTasks.length} tasks
            </div>

            {/* Tasks Grid */}
            {filteredTasks.length === 0 ? (
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">No tasks found</h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        Try adjusting your filters or create a new task
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTasks.map((task) => (
                        <TaskCard key={task.ID} task={task} onClick={handleTaskClick} />
                    ))}
                </div>
            )}
        </div>
    );
}

