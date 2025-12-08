import { Contact } from "../../definitions/backend/contacts";
import { Appointment } from "../../definitions/backend/appointments";
import { cookies } from "next/headers";

const BASE_URL = process.env.BASE_URL



// ----------------------------------------------
// Get Dashboard Contacts
// ----------------------------------------------

export async function GetDashboardContacts(): Promise<Contact[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');
    const res = await fetch(`${BASE_URL}/dashboard/5-newest-contacts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching dashboard contacts: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Appointment Count
// ----------------------------------------------

export async function GetAppointmentCount(): Promise<number> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/dashboard/appointments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching appointment count: ${res.statusText}`);
    }

    const data = await res.json();
    return data.appointments_count;
}

// ----------------------------------------------
// Get Task Count
// ----------------------------------------------

export async function GetTaskCount(): Promise<number> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/dashboard/tasks-today`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching task count: ${res.statusText}`);
    }

    const data = await res.json();
    return data.tasks_due_today_count;
}

// ----------------------------------------------
// New Contacts Count
// ----------------------------------------------

export async function GetNewContactsCount(): Promise<number> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/dashboard/new-contacts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching new contacts count: ${res.statusText}`);
    }

    const data = await res.json();
    return data.new_contacts_count;
}

// ----------------------------------------------
// Get 5 Upcoming Appointments
// ----------------------------------------------

export async function GetUpcomingAppointments(): Promise<Appointment[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/dashboard/5-upcoming-appointments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching upcoming appointments: ${res.statusText}`);
    } return res.json();
}

// ----------------------------------------------
// Get Contacts Count 
// ----------------------------------------------

export async function GetContactsCount(): Promise<number> {
    const cookieStore = await cookies();
    const session = cookieStore.get("crm.session_token");
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/dashboard/contacts-count`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `crm.session_token=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching contacts count: ${res.statusText}`);
    }

    const data = await res.json();
    return data.contacts_count;
}
