import { Appointment } from '../../definitions/backend/appointments';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL

const NODE_ENV = process.env.NODE_ENV;
let cookieName = "__Secure-crm.session_token";
if (NODE_ENV !== 'production') {
    cookieName = "crm.session_token";
}


// ----------------------------------------------
// Get Appointment by ID
// ----------------------------------------------

export async function GetAppointmentByID(appointment_id: string): Promise<Appointment> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/appointments/${appointment_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching appointment: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Update Appointment
// ----------------------------------------------

export async function UpdateAppointment(appointment_id: string, contact_id: string, title: string, scheduled_at: string, notes: string, outcome: string, location: string, type: string): Promise<Appointment> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/appointments/${appointment_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
        body: JSON.stringify({
            contact_id,
            title,
            scheduled_at,
            notes,
            outcome,
            location,
            type,
        }),
    });

    if (!res.ok) {
        throw new Error(`Error updating appointment: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Delete Appointment
// ----------------------------------------------

export async function DeleteAppointment(appointment_id: string): Promise<void> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/appointments/${appointment_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error deleting appointment: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// List Today's Appointments
// ----------------------------------------------

export async function ListTodaysAppointments(): Promise<Appointment[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/appointments/today`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching today's appointments: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// List Upcoming Appointments
// ----------------------------------------------

export async function ListUpcomingAppointments(): Promise<Appointment[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/appointments/upcoming`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching upcoming appointments: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// List Past Appointments
// ----------------------------------------------

export async function ListPastAppointments(): Promise<Appointment[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/appointments/past`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching past appointments: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// List All Appointments
// ----------------------------------------------

export async function ListAllAppointments(): Promise<Appointment[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/appointments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching all appointments: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// List Appointments by Contact ID
// ----------------------------------------------

export async function ListAppointmentsByContactID(contact_id: string): Promise<Appointment[]> {
    const cookieStore = await cookies();
    const session = cookieStore.get(cookieName);
    const encoded = encodeURIComponent(session?.value || '');

    const res = await fetch(`${BASE_URL}/appointments/contact/${contact_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${cookieName}=${encoded}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Error fetching appointments by contact ID: ${res.statusText}`);
    }

    return res.json();
}
