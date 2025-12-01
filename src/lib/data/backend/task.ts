import { toast } from 'sonner';
import { Task } from '../../definitions/backend/tasks';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';

// ----------------------------------------------
// Create Task
// ----------------------------------------------

export async function CreateTask(contact_id: string, assigned_to_id: string, title: string, type: string, date: string, status: string, priority: string, note: string): Promise<Task> {
    const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id,
            assigned_to_id,
            title,
            type,
            date,
            status,
            priority,
            note,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating task: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Task by Contact ID
// ----------------------------------------------

export async function GetTasksByContactID(contact_id: string): Promise<Task[]> {
    const res = await fetch(`${BASE_URL}/tasks/contact/${contact_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching tasks: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Task By Assigned To ID
// ----------------------------------------------

export async function GetTasksByAssignedToID(assigned_to_id: string): Promise<Task[]> {
    const res = await fetch(`${BASE_URL}/tasks/assigned/${assigned_to_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching tasks: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Task by ID
// ----------------------------------------------

export async function GetTaskByID(task_id: string): Promise<Task> {
    const res = await fetch(`${BASE_URL}/tasks/${task_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching task: ${res.statusText}`);
    }
    return res.json();
}

// ----------------------------------------------
// Delete Task
// ----------------------------------------------

export async function DeleteTask(task_id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/tasks/${task_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error deleting task: ${res.statusText}`);
    }
}

// ----------------------------------------------
// Update Task
// ----------------------------------------------

export async function UpdateTask(task_id: string, contact_id: string, assigned_to_id: string, title: string, type: string, date: string, status: string, priority: string, note: string): Promise<Task> {
    const res = await fetch(`${BASE_URL}/tasks/${task_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id,
            assigned_to_id,
            title,
            type,
            date,
            status,
            priority,
            note,
        }),
    });

    if (!res.ok) {
        toast.error(`Error updating task: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Update Task Status
// ----------------------------------------------

export async function UpdateTaskStatus(task_id: string, status: string): Promise<Task> {
    const res = await fetch(`${BASE_URL}/tasks/${task_id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            status,
        }),
    });

    if (!res.ok) {
        toast.error(`Error updating task status: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Late Tasks
// ----------------------------------------------

export async function GetLateTasks(assigned_to_id: string): Promise<Task[]> {
    const res = await fetch(`${BASE_URL}/tasks/late/${assigned_to_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching late tasks: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Tasks Due Today
// ----------------------------------------------

export async function GetTasksDueToday(assigned_to_id: string): Promise<Task[]> {
    const res = await fetch(`${BASE_URL}/tasks/today/${assigned_to_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching tasks due today: ${res.statusText}`);
    }

    return res.json();
}
