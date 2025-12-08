import { toast } from 'sonner';
import { ContactLog } from '../../definitions/backend/contactLogs';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL
const NODE_ENV = process.env.NODE_ENV;

let cookieName = "__Secure-crm.session_token";
if (NODE_ENV !== 'production') {
    cookieName = "crm.session_token";
}

// ----------------------------------------------
// Get Contact Logs by Contact ID
// ----------------------------------------------

export async function GetContactLogByID(contact_id: string): Promise<ContactLog[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/contact-logs/${contact_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching contact logs: ${res.statusText}`);
    }

    return res.json();
}
