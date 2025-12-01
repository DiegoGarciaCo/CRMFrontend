import { toast } from 'sonner';
import { ContactNote } from '../../definitions/backend/notes';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';

// ----------------------------------------------
// Create Contact Note
// ----------------------------------------------

export async function CreateContactNote(contact_id: string, note: string, created_by: string): Promise<ContactNote> {
    const res = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id,
            note,
            created_by,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating contact note: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Contact Notes by Contact ID
// ----------------------------------------------

export async function GetContactNotesByContactID(contact_id: string): Promise<ContactNote[]> {
    const res = await fetch(`${BASE_URL}/notes/${contact_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching contact notes: ${res.statusText}`);
    }

    return res.json();
}
