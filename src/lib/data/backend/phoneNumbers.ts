import { PhoneNumber } from '../../definitions/backend/phoneNumbers';

const BASE_URL = process.env.BASE_URL

// ----------------------------------------------
// Get Phone Numbers by Contact ID
// ----------------------------------------------

export async function GetPhoneNumbersByContactID(contactID: string): Promise<PhoneNumber[]> {
    const res = await fetch(`${BASE_URL}/phone-numbers/contact/${contactID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        console.error(`Error fetching phone numbers: ${res.statusText}`);
        return [];
    }

    return res.json();
}

// ----------------------------------------------
// Create Phone Number
// ----------------------------------------------

export async function CreatePhoneNumber(contactID: string, phoneNumber: string, type: string, isPrimary: boolean): Promise<PhoneNumber> {
    const res = await fetch(`${BASE_URL}/phone-numbers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id: contactID,
            phone_number: phoneNumber,
            type,
            is_primary: isPrimary,
        }),
    });

    if (!res.ok) {
        throw new Error(`Error creating phone number: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Update Phone Number
// ----------------------------------------------

export async function UpdatePhoneNumber(phoneNumberID: string, phoneNumber: string, type: string, isPrimary: boolean): Promise<PhoneNumber> {
    const res = await fetch(`${BASE_URL}/phone-numbers/${phoneNumberID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phone_number: phoneNumber,
            type,
            is_primary: isPrimary,
        }),
    });

    if (!res.ok) {
        throw new Error(`Error updating phone number: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Delete Phone Number
// ----------------------------------------------

export async function DeletePhoneNumber(phoneNumberID: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/phone-numbers/${phoneNumberID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Error deleting phone number: ${res.statusText}`);
    }
}

