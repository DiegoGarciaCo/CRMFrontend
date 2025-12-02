import { toast } from 'sonner';
import { SmartList } from '../../definitions/backend/smartList';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';

// ----------------------------------------------
// Get All Smart Lists
// ----------------------------------------------

export async function GetAllSmartLists(user_id: string): Promise<SmartList[]> {
    const res = await fetch(`${BASE_URL}/smart-lists/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        toast.error(`Error fetching smart lists: ${res.statusText}`);
    }

    console.log(res.json);
    return res.json();
}

// ----------------------------------------------
// Get Smart List by ID
// ----------------------------------------------

export async function GetSmartListByID(list_id: string): Promise<SmartList> {
    const res = await fetch(`${BASE_URL}/smart-lists/${list_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        toast.error(`Error fetching smart list: ${res.statusText}`);
    }

    return res.json();
}

export async function CreateSmartList(user_id: string, name: string, description: string): Promise<SmartList> {
    const res = await fetch(`${BASE_URL}/smart-lists/${user_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            description,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating smart list: ${res.statusText}`);
    }

    return res.json();
}

export async function UpdateSmartList(list_id: string, name: string, description: string, filterCriteria: any): Promise<SmartList> {
    const res = await fetch(`${BASE_URL}/smart-lists/name/${list_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            description,
            filterCriteria,
        }),
    });

    if (!res.ok) {
        toast.error(`Error updating smart list: ${res.statusText}`);
    }

    return res.json();
}

export async function SetSmartListFilterCriteria(smart_list_id: string, filter_criteria: any): Promise<SmartList> {
    console.log('Setting filter criteria:', filter_criteria);
    const res = await fetch(`${BASE_URL}/smart-lists/${smart_list_id}/filter`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            filter_criteria,
        }),
    });

    if (!res.ok) {
        toast.error(`Error updating smart list filter criteria: ${res.statusText}`);
    }

    return res.json();
}
