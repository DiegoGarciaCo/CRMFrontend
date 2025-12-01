import { toast } from 'sonner';
import { Goal } from '../../definitions/backend/goals';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';

// ----------------------------------------------
// Create Goal
// ----------------------------------------------

export async function CreateGoal(year: number, month: number, income_goal: string, transaction_goal: string, estimated_average_sale_price: string, estimated_average_commission_rate: string, userId: string): Promise<Goal> {
    const res = await fetch(`${BASE_URL}/goals/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            year,
            month,
            income_goal,
            transaction_goal,
            estimated_average_sale_price,
            estimated_average_commission_rate
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating goal: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Goals by User ID and Year
// ----------------------------------------------

export async function GetGoalsByUserIDAndYear(user_id: string, year: number): Promise<Goal[]> {
    const res = await fetch(`${BASE_URL}/goals/${user_id}?year=${year}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching goals: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
}

// ----------------------------------------------
// Update Goal
// ----------------------------------------------

export async function UpdateGoal(goal_id: string, updatedFields: Partial<Goal>): Promise<Goal> {
    const res = await fetch(`${BASE_URL}/goals/${goal_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
    });

    if (!res.ok) {
        toast.error(`Error updating goal: ${res.statusText}`);
    }

    return res.json();
}
