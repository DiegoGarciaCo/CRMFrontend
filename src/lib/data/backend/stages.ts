import { Stage } from '../../definitions/backend/stage';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL

// ----------------------------------------------
// Get All Stages
// ----------------------------------------------

export async function GetAllStages(): Promise<Stage[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/stages`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
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
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/stages/${stage_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Error fetching stage: ${res.statusText}`);
    }

    return res.json();
}


