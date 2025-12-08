import { Email } from '../../definitions/backend/emails';

const BASE_URL = process.env.BASE_URL

// ----------------------------------------------
// Get Emails by Contact ID
// ----------------------------------------------

export async function GetEmailsByContactID(contactID: string): Promise<Email[]> {
    const res = await fetch(`${BASE_URL}/emails/contact/${contactID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        console.error(`Error fetching emails: ${res.statusText}`);
        return [];
    }

    return res.json();
}

// ----------------------------------------------
// Create Email
// ----------------------------------------------

export async function CreateEmail(contactID: string, email: string, type: string, isPrimary: boolean): Promise<Email> {
    const res = await fetch(`${BASE_URL}/emails`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id: contactID,
            email,
            type,
            is_primary: isPrimary,
        }),
    });

    if (!res.ok) {
        throw new Error(`Error creating email: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Update Email
// ----------------------------------------------

export async function UpdateEmail(emailID: string, email: string, type: string, isPrimary: boolean): Promise<Email> {
    const res = await fetch(`${BASE_URL}/emails/${emailID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            type,
            is_primary: isPrimary,
        }),
    });

    if (!res.ok) {
        throw new Error(`Error updating email: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Delete Email
// ----------------------------------------------

export async function DeleteEmail(emailID: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/emails/${emailID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Error deleting email: ${res.statusText}`);
    }
}

