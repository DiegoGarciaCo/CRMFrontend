import { Stage } from '../../definitions/backend/stage';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL
const NODE_ENV = process.env.NODE_ENV;

let cookieName = "__Secure-crm.session_token";
if (NODE_ENV !== 'production') {
    cookieName = "crm.session_token";
}

// ----------------------------------------------
// Get All Stages
// ----------------------------------------------

export async function GetAllStages(): Promise<Stage[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/stages`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Error fetching stages: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Stage by ID
// ----------------------------------------------

export async function GetStageByID(stage_id: string): Promise<Stage> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/stages/${stage_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Error fetching stage: ${res.statusText}`);
    }

    return res.json();
}


