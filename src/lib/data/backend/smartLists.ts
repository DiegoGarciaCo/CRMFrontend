import { SmartList } from '../../definitions/backend/smartList';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL
const NODE_ENV = process.env.NODE_ENV;

let cookieName = "__Secure-crm.session_token";
if (NODE_ENV !== 'production') {
    cookieName = "crm.session_token";
}

// ----------------------------------------------
// Get All Smart Lists
// ----------------------------------------------

export async function GetAllSmartLists(): Promise<SmartList[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/smart-lists`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Error fetching smart lists: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Smart List by ID
// ----------------------------------------------

export async function GetSmartListByID(list_id: string): Promise<SmartList> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/smart-lists/${list_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Error fetching smart list: ${res.statusText}`);
    }

    return res.json();
}


export async function UpdateSmartList(list_id: string, name: string, description: string, filterCriteria: any): Promise<SmartList> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/smart-lists/name/${list_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
        body: JSON.stringify({
            name,
            description,
            filterCriteria,
        }),
    });

    if (!res.ok) {
        throw new Error(`Error updating smart list: ${res.statusText}`);
    }

    return res.json();
}

