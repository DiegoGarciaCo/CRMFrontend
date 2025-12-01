import { toast } from 'sonner';
import { Appointment } from '../../definitions/backend/appointments';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';

// ----------------------------------------------
// Create Appointment
// ----------------------------------------------

export async function CreateAppointment(assigned_to_id: string, contact_id: string, title: string, scheduled_at: string, notes: string, outcome: string, location: string, type: string): Promise<Appointment> {
    const res = await fetch(`${BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            assigned_to_id,
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
        toast.error(`Error creating appointment: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Appointment by ID
// ----------------------------------------------

export async function GetAppointmentByID(appointment_id: string): Promise<Appointment> {
    const res = await fetch(`${BASE_URL}/appointments/${appointment_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching appointment: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Update Appointment
// ----------------------------------------------

export async function UpdateAppointment(appointment_id: string, contact_id: string, title: string, scheduled_at: string, notes: string, outcome: string, location: string, type: string): Promise<Appointment> {
    const res = await fetch(`${BASE_URL}/appointments/${appointment_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
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
        toast.error(`Error updating appointment: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Delete Appointment
// ----------------------------------------------

export async function DeleteAppointment(appointment_id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/appointments/${appointment_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error deleting appointment: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// List Today's Appointments
// ----------------------------------------------

export async function ListTodaysAppointments(assignedToID: string): Promise<Appointment[]> {
    const res = await fetch(`${BASE_URL}/appointments/today/${assignedToID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching today's appointments: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// List Upcoming Appointments
// ----------------------------------------------

export async function ListUpcomingAppointments(assignedToID: string): Promise<Appointment[]> {
    const res = await fetch(`${BASE_URL}/appointments/upcoming/${assignedToID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching upcoming appointments: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// List Past Appointments
// ----------------------------------------------

export async function ListPastAppointments(assignedToID: string): Promise<Appointment[]> {
    const res = await fetch(`${BASE_URL}/appointments/past/${assignedToID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching past appointments: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// List All Appointments
// ----------------------------------------------

export async function ListAllAppointments(assignedToID: string): Promise<Appointment[]> {
    const res = await fetch(`${BASE_URL}/appointments/assigned/${assignedToID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching all appointments: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// List Appointments by Contact ID
// ----------------------------------------------

export async function ListAppointmentsByContactID(contact_id: string): Promise<Appointment[]> {
    const res = await fetch(`${BASE_URL}/appointments/contact/${contact_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching appointments for contact: ${res.statusText}`);
    }

    return res.json();
}
