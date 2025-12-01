import { Contact } from "../../definitions/backend/contacts";
import { Appointment } from "../../definitions/backend/appointments";
import { toast } from "sonner";
import { Task } from "@/lib/definitions/backend/tasks";

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api';

// ----------------------------------------------
// Get Dashboard Contacts
// ----------------------------------------------

export async function GetDashboardContacts(): Promise<Contact[]> {
    const res = await fetch(`${BASE_URL}/dashboard/5-newest-contacts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching dashboard contacts: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Appointment Count
// ----------------------------------------------

export async function GetAppointmentCount(assigned_to_id: string): Promise<number> {
    const res = await fetch(`${BASE_URL}/dashboard/appointments/${assigned_to_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching appointment count: ${res.statusText}`);
    }

    const data = await res.json();
    return data.appointments_count;
}

// ----------------------------------------------
// Get Task Count
// ----------------------------------------------

export async function GetTaskCount(assigned_to_id: string): Promise<number> {
    const res = await fetch(`${BASE_URL}/dashboard/tasks-today/${assigned_to_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching task count: ${res.statusText}`);
    }

    const data = await res.json();
    return data.tasks_due_today_count;
}

// ----------------------------------------------
// New Contacts Count
// ----------------------------------------------

export async function GetNewContactsCount(owner_id: string): Promise<number> {
    const res = await fetch(`${BASE_URL}/dashboard/new-contacts/${owner_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching new contacts count: ${res.statusText}`);
    }

    const data = await res.json();
    return data.new_contacts_count;
}

// ----------------------------------------------
// Get 5 Upcoming Appointments
// ----------------------------------------------

export async function GetUpcomingAppointments(assigned_to_id: string): Promise<Appointment[]> {
    const res = await fetch(`${BASE_URL}/dashboard/5-upcoming-appointments/${assigned_to_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching upcoming appointments: ${res.statusText}`);
    } return res.json();
}

// ----------------------------------------------
// Get Contacts Count 
// ----------------------------------------------

export async function GetContactsCount(owner_id: string): Promise<number> {
    const res = await fetch(`${BASE_URL}/dashboard/contacts-count/${owner_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching contacts count: ${res.statusText}`);
    }

    const data = await res.json();
    return data.contacts_count;
}
