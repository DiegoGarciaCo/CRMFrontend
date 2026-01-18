'use client';

import { Task } from '@/lib/definitions/backend/tasks';
import EditTaskModal from './UpdateTaskModal';

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
    return (
        <EditTaskModal variant="card" task={task} />
    );
}

