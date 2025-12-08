import { toast } from 'sonner';
import { Task } from '../../definitions/backend/tasks';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL


// ----------------------------------------------
// Get Task by Contact ID
// ----------------------------------------------

export async function GetTasksByContactID(contact_id: string): Promise<Task[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/tasks/contact/${contact_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching tasks: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Task By Assigned To ID
// ----------------------------------------------

export async function GetTasksByAssignedToID(): Promise<Task[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/tasks/assigned`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching tasks: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Task by ID
// ----------------------------------------------

export async function GetTaskByID(task_id: string): Promise<Task> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/tasks/${task_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching task: ${res.statusText}`);
    }
    return res.json();
}

// ----------------------------------------------
// Delete Task
// ----------------------------------------------

export async function DeleteTask(task_id: string): Promise<void> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/tasks/${task_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error deleting task: ${res.statusText}`);
    }
}

// ----------------------------------------------
// Update Task
// ----------------------------------------------

export async function UpdateTask(task_id: string, contact_id: string, assigned_to_id: string, title: string, type: string, date: string, status: string, priority: string, note: string): Promise<Task> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/tasks/${task_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
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
        throw new Error(`Error updating task: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Update Task Status
// ----------------------------------------------

export async function UpdateTaskStatus(task_id: string, status: string): Promise<Task> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/tasks/${task_id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
        body: JSON.stringify({
            status,
        }),
    });

    if (!res.ok) {
        throw new Error(`Error updating task status: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Late Tasks
// ----------------------------------------------

export async function GetLateTasks(): Promise<Task[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/tasks/late`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching late tasks: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Tasks Due Today
// ----------------------------------------------

export async function GetTasksDueToday(): Promise<Task[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/tasks/today`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching tasks due today: ${res.statusText}`);
    }

    return res.json();
}
