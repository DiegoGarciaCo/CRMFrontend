import { toast } from 'sonner';
import { ContactLog } from '../../definitions/backend/contactLogs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';

// ----------------------------------------------
// Create Contact Log
// ----------------------------------------------

export async function CreateContactLog(contact_id: string, contact_method: string, created_by: string, note: string): Promise<ContactLog> {
    const res = await fetch(`${BASE_URL}/contact-logs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id,
            contact_method,
            created_by,
            note,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating contact log: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Contact Logs by Contact ID
// ----------------------------------------------

export async function GetContactLogByID(contact_id: string): Promise<ContactLog[]> {
    const res = await fetch(`${BASE_URL}/contact-logs/${contact_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching contact logs: ${res.statusText}`);
    }

    return res.json();
}
