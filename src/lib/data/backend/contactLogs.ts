import { toast } from 'sonner';
import { ContactLog } from '../../definitions/backend/contactLogs';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';


// ----------------------------------------------
// Get Contact Logs by Contact ID
// ----------------------------------------------

export async function GetContactLogByID(contact_id: string): Promise<ContactLog[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/contact-logs/${contact_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching contact logs: ${res.statusText}`);
    }

    return res.json();
}
