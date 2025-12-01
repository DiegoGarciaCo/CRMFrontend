import { toast } from 'sonner';
import { Stage } from '../../definitions/backend/stage';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';

// ----------------------------------------------
// Get All Stages
// ----------------------------------------------

export async function GetAllStages(ownerID: string): Promise<Stage[]> {
    const res = await fetch(`${BASE_URL}/stages/${ownerID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        toast.error(`Error fetching stages: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Stage by ID
// ----------------------------------------------

export async function GetStageByID(stage_id: string): Promise<Stage> {
    const res = await fetch(`${BASE_URL}/stages/${stage_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        toast.error(`Error fetching stage: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Create Stage
// ----------------------------------------------

export async function CreateStage(name: string, description: string, client_type: string, order_index: number, userId: string): Promise<Stage> {
    const res = await fetch(`${BASE_URL}/stages/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            description,
            client_type,
            order_index,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating stage: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Stages by Client Type
// ----------------------------------------------

export async function GetStagesByClientType(client_type: string, ownerID: string): Promise<Stage[]> {
    if (client_type != 'buyer' && client_type != 'seller') {
        toast.error(`Invalid client type: ${client_type}`);
        return [];
    }
    const res = await fetch(`${BASE_URL}/stages/client-type/${ownerID}?client=${client_type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        toast.error(`Error fetching stages by client type: ${res.statusText}`);
    }

    return res.json();
}
