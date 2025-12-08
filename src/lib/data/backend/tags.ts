import { cookies } from 'next/headers';
import { Tag } from '../../definitions/backend/tag';

const BASE_URL = process.env.BASE_URL
const NODE_ENV = process.env.NODE_ENV;

let cookieName = "__Secure-crm.session_token";
if (NODE_ENV !== 'production') {
    cookieName = "crm.session_token";
}


// ----------------------------------------------
// Get All Tags for User
// ----------------------------------------------

export async function GetAllTags(): Promise<Tag[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/tags`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Error fetching tags: ${res.statusText}`);
    }

    return res.json();
}


// ----------------------------------------------
// Delete Tag
// ----------------------------------------------

export async function DeleteTag(tagID: string): Promise<void> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);

    const res = await fetch(`${BASE_URL}/tags/${tagID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${session?.value}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error deleting tag: ${res.statusText}`);
    }
}
