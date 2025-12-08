import { Goal } from '../../definitions/backend/goals';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL
const NODE_ENV = process.env.NODE_ENV;

let cookieName = "__Secure-crm.session_token";
if (NODE_ENV !== 'production') {
    cookieName = "crm.session_token";
}


// ----------------------------------------------
// Get Goals by User ID and Year
// ----------------------------------------------

export async function GetGoalsByUserIDAndYear(year: number): Promise<Goal[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/goals?year=${year}`, {

        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching goals: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
}

// ----------------------------------------------
// Update Goal
// ----------------------------------------------

export async function UpdateGoal(goal_id: string, updatedFields: Partial<Goal>): Promise<Goal> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/goals/${goal_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
        body: JSON.stringify(updatedFields),
    });

    if (!res.ok) {
        throw new Error(`Error updating goal: ${res.statusText}`);
    }

    return res.json();
}
