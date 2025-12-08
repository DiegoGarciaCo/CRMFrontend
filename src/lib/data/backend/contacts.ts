import { Contact, ContactWithDetails } from '../../definitions/backend/contacts';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL
const NODE_ENV = process.env.NODE_ENV;
let cookieName = "__Secure-crm.session_token";
if (NODE_ENV !== 'production') {
    cookieName = "crm.session_token";
}


// ----------------------------------------------
// Get Contact By ID
// ----------------------------------------------

export async function GetContactByID(contactID: string): Promise<ContactWithDetails> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/contacts/contact/${contactID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching contact: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get All Contacts
// ----------------------------------------------

export async function GetAllContacts(): Promise<Contact[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/contacts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching all contacts: ${res.statusText}`);
    }

    console.log(res.json);
    return res.json();
}



