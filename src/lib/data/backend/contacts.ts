import { toast } from 'sonner';
import { Contact } from '../../definitions/backend/contacts';
import { CreateContactEmailInput } from '../../definitions/backend/emails';
import { CreateContactPhoneNumberInput } from '../../definitions/backend/phoneNumbers';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';

// ----------------------------------------------
// Create Contact
// ----------------------------------------------

export async function CreateContact(first_name: string, last_name: string, phone_numbers: CreateContactPhoneNumberInput[], emails: CreateContactEmailInput[], birthdate: string, source: string, status: string, address: string, city: string, state: string, zipCode: string, lender: string, price_range: string, timeframe: string, owner_id: string): Promise<Contact> {
    const res = await fetch(`${BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name,
            last_name,
            phone_numbers,
            emails,
            birthdate,
            source,
            status,
            address,
            city,
            state,
            zipCode,
            lender,
            price_range,
            timeframe,
            owner_id,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating contact: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Contact By ID
// ----------------------------------------------

export async function GetContactByID(contactID: string): Promise<Contact> {
    const res = await fetch(`${BASE_URL}/contacts/contact/${contactID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching contact: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get All Contacts
// ----------------------------------------------

export async function GetAllContacts(ownerID: string): Promise<Contact[]> {
    const res = await fetch(`${BASE_URL}/contacts/${ownerID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching contacts: ${res.statusText}`);
    }

    console.log(res.json);
    return res.json();
}

// ----------------------------------------------
// Import Contacts from CSV
// ----------------------------------------------

export async function ImportContactsFromCSV(csv: File): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('file', csv);

    const res = await fetch(`${BASE_URL}/contacts/import`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        toast.error(`Error importing contacts: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Search Contacts
// ----------------------------------------------

export async function SearchContacts(ownerID: string, query: string): Promise<Contact[]> {
    const res = await fetch(`${BASE_URL}/contacts/search/${ownerID}?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error searching contacts: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Contacts by Smart List ID
// ----------------------------------------------

export async function GetContactsBySmartListID(list_id: string): Promise<Contact[]> {
    const res = await fetch(`${BASE_URL}/contacts/smart-list/${list_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching contacts: ${res.statusText}`);
    }

    return res.json();
}
