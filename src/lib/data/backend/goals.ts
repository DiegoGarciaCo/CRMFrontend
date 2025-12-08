import { Goal } from '../../definitions/backend/goals';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL


// ----------------------------------------------
// Get Goals by User ID and Year
// ----------------------------------------------

export async function GetGoalsByUserIDAndYear(year: number): Promise<Goal[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/goals?year=${year}`, {

        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
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
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/goals/${goal_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
        body: JSON.stringify(updatedFields),
    });

    if (!res.ok) {
        throw new Error(`Error updating goal: ${res.statusText}`);
    }

    return res.json();
}
