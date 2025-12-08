import { Deal } from '../../definitions/backend/deals';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL
const NODE_ENV = process.env.NODE_ENV;

let cookieName = "__Secure-crm.session_token";
if (NODE_ENV !== 'production') {
    cookieName = "crm.session_token";
}


// ----------------------------------------------
// Get Deal by ID
// ----------------------------------------------

export async function GetDealByID(deal_id: string): Promise<Deal> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/deals/${deal_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching deal: ${res.statusText}`);
    }

    return res.json();
}


// ----------------------------------------------
// Delete Deal
// ----------------------------------------------

export async function DeleteDeal(deal_id: string): Promise<void> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/deals/${deal_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error deleting deal: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// List Deals by Assigned To ID
// ----------------------------------------------

export async function GetDealsByAssignedToID(): Promise<Deal[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/deals`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching deals: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// List Deals By Stage ID
// ----------------------------------------------

export async function GetDealsByStageID(state_id: string): Promise<Deal[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/deals/stage/${state_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching deals: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// List Deals By Contact ID
// ----------------------------------------------

export async function GetDealsByContactID(contact_id: string): Promise<Deal[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/deals/contact/${contact_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching deals: ${res.statusText}`);
    }

    return res.json();
}
