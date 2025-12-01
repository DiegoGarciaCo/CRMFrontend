import { toast } from 'sonner';
import { Deal } from '../../definitions/backend/deals';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';

// ----------------------------------------------
// Create Deal
// ----------------------------------------------

export async function CreateDeal(contact_id: string, assigned_to_id: string, title: string, price: number, closing_date: string, earnest_money_due_date: string, mutual_acceptance_date: string, inspection_date: string, appraisal_date: string, final_walkthrough_date: string, possession_date: string, commission: number, commission_split: number, property_address: string, property_city: string, property_state: string, property_zip: string, description: string, stage_id: string): Promise<Deal> {
    const res = await fetch(`${BASE_URL}/deals`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id,
            assigned_to_id,
            title,
            price,
            closing_date,
            earnest_money_due_date,
            mutual_acceptance_date,
            inspection_date,
            appraisal_date,
            final_walkthrough_date,
            possession_date,
            commission,
            commission_split,
            property_address,
            property_city,
            property_state,
            property_zip,
            description,
            stage_id,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating deal: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Deal by ID
// ----------------------------------------------

export async function GetDealByID(deal_id: string): Promise<Deal> {
    const res = await fetch(`${BASE_URL}/deals/${deal_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching deal: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Update Deal
// ----------------------------------------------

export async function UpdateDeal(deal_id: string, contact_id: string, assigned_to_id: string, title: string, price: number, closing_date: string, earnest_money_due_date: string, mutual_acceptance_date: string, inspection_date: string, appraisal_date: string, final_walkthrough_date: string, possession_date: string, commission: number, commission_split: number, property_address: string, property_city: string, property_state: string, property_zip: string, description: string, stage_id: string): Promise<Deal> {
    const res = await fetch(`${BASE_URL}/deals/${deal_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id,
            assigned_to_id,
            title,
            price,
            closing_date,
            earnest_money_due_date,
            mutual_acceptance_date,
            inspection_date,
            appraisal_date,
            final_walkthrough_date,
            possession_date,
            commission,
            commission_split,
            property_address,
            property_city,
            property_state,
            property_zip,
            description,
            stage_id,
        }),
    });

    if (!res.ok) {
        toast.error(`Error updating deal: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Delete Deal
// ----------------------------------------------

export async function DeleteDeal(deal_id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/deals/${deal_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error deleting deal: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// List Deals by Assigned To ID
// ----------------------------------------------

export async function GetDealsByAssignedToID(assigned_to_id: string): Promise<Deal[]> {
    const res = await fetch(`${BASE_URL}/deals/assigned/${assigned_to_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching deals: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// List Deals By Stage ID
// ----------------------------------------------

export async function GetDealsByStageID(state_id: string): Promise<Deal[]> {
    const res = await fetch(`${BASE_URL}/deals/stage/${state_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching deals: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// List Deals By Contact ID
// ----------------------------------------------

export async function GetDealsByContactID(contact_id: string): Promise<Deal[]> {
    const res = await fetch(`${BASE_URL}/deals/contact/${contact_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching deals: ${res.statusText}`);
    }

    return res.json();
}
