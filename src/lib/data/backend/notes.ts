import { toast } from 'sonner';
import { ContactNote } from '../../definitions/backend/notes';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';


// ----------------------------------------------
// Get Contact Notes by Contact ID
// ----------------------------------------------

export async function GetContactNotesByContactID(contact_id: string): Promise<ContactNote[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/notes/${contact_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching contact notes: ${res.statusText}`);
    }

    return res.json();
}
