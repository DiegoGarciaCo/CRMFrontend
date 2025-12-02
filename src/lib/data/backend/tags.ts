import { Tag } from '../../definitions/backend/tag';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';


// ----------------------------------------------
// Get All Tags for User
// ----------------------------------------------

export async function GetAllTags(userID: string): Promise<Tag[]> {
    const res = await fetch(`${BASE_URL}/tags/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        console.error(`Error fetching tags: ${res.statusText}`);
        return [];
    }

    return res.json();
}

// ----------------------------------------------
// Add Tag to Contact
// ----------------------------------------------

export async function AddTagToContact(contactID: string, tagID: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/tags/${tagID}/contact/${contactID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Error adding tag to contact: ${res.statusText}`);
    }
}

// ----------------------------------------------
// Remove Tag from Contact
// ----------------------------------------------

export async function RemoveTagFromContact(contactID: string, tagID: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/tags/${tagID}/contact/${contactID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Error removing tag from contact: ${res.statusText}`);
    }
}

// ----------------------------------------------
// Create Tag
// ----------------------------------------------

export async function CreateTag(name: string, description: string, userID: string): Promise<Tag> {
    const res = await fetch(`${BASE_URL}/tags`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            description,
            user_id: userID,
        }),
    });

    if (!res.ok) {
        throw new Error(`Error creating tag: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Delete Tag
// ----------------------------------------------

export async function DeleteTag(tagID: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/tags/${tagID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Error deleting tag: ${res.statusText}`);
    }
}
