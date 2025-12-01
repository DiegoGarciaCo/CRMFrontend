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

