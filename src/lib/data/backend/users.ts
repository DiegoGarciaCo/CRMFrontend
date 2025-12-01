import { User } from '../../definitions/backend/users';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';

// ----------------------------------------------
// Create User
// ----------------------------------------------

export async function CreateUser(username: string, email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
        }),
    });

    if (!res.ok) {
        throw new Error(`Error creating user: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Create User With Team
// ----------------------------------------------

export async function CreateUserWithTeam(username: string, email: string, password: string, team_id: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/users/team`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
            team_id,
        }),
    });

    if (!res.ok) {
        throw new Error(`Error creating user with team: ${res.statusText}`);
    }

    return res.json();
}
