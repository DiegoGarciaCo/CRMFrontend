import { Notification } from "@/lib/definitions/backend/mentions";
import { cookies } from "next/headers";

const BASE_URL = process.env.BASE_URL
const NODE_ENV = process.env.NODE_ENV;

let cookieName = "__Secure-crm.session_token";
if (NODE_ENV !== 'production') {
    cookieName = "crm.session_token";
}

// ----------------------------------------------
// Get Notifications for User
// ----------------------------------------------

export async function GetNotificationsForUser(): Promise<Notification[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/notifications`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching notifications: ${res.statusText}`);
    }

    return res.json();
}
