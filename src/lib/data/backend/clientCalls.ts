import { Appointment } from "@/lib/definitions/backend/appointments";
import { ContactLog } from "@/lib/definitions/backend/contactLogs";
import { Contact } from "@/lib/definitions/backend/contacts";
import { Deal } from "@/lib/definitions/backend/deals";
import { CreateContactEmailInput } from "@/lib/definitions/backend/emails";
import { Goal } from "@/lib/definitions/backend/goals";
import { MentionData } from "@/lib/definitions/backend/mentions";
import { ContactNote } from "@/lib/definitions/backend/notes";
import { CreateContactPhoneNumberInput } from "@/lib/definitions/backend/phoneNumbers";
import { SmartList } from "@/lib/definitions/backend/smartList";
import { Stage } from "@/lib/definitions/backend/stage";
import { Tag } from "@/lib/definitions/backend/tag";
import { Task } from "@/lib/definitions/backend/tasks";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

// ----------------------------------------------
// Create Appointment
// ----------------------------------------------
//
export async function CreateAppointment(contact_id: string, title: string, scheduled_at: string, notes: string, outcome: string, location: string, type: string): Promise<Appointment> {
    const res = await fetch(`${BASE_URL}/appointments`, {
        method: 'POST',
        credentials: 'include',
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
        toast.error(`Error creating appointment: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Create Contact
// ----------------------------------------------

export async function CreateContact(first_name: string, last_name: string, phone_numbers: CreateContactPhoneNumberInput[], emails: CreateContactEmailInput[], birthdate: string, source: string, status: string, address: string, city: string, state: string, zipCode: string, lender: string, price_range: string, timeframe: string): Promise<Contact> {
    console.log("Creating Contact")
    console.log("BASE_URL:", BASE_URL);
    const res = await fetch(`${BASE_URL}/contacts`, {
        method: 'POST',
        credentials: 'include',
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
        }),
    });

    if (!res.ok) {
        console.log("Response status:", res.status);
        console.log("Base URL:", BASE_URL);
        toast.error(`Error creating contact: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Search Contacts
// ----------------------------------------------

export async function SearchContacts(query: string): Promise<Contact[]> {
    const res = await fetch(`${BASE_URL}/contacts/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Error searching contacts: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Create Task
// ----------------------------------------------

export async function CreateTask(contact_id: string, title: string, type: string, date: string, status: string, priority: string, note: string): Promise<Task> {
    const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id,
            title,
            type,
            date,
            status,
            priority,
            note,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating task: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Create Deal
// ----------------------------------------------

export async function CreateDeal(contact_id: string, title: string, price: number, closing_date: string, earnest_money_due_date: string, mutual_acceptance_date: string, inspection_date: string, appraisal_date: string, final_walkthrough_date: string, possession_date: string, closed_date: string, commission: number, commission_split: number, property_address: string, property_city: string, property_state: string, property_zip: string, description: string, stage_id: string): Promise<Deal> {
    const res = await fetch(`${BASE_URL}/deals`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id,
            title,
            price,
            closing_date,
            earnest_money_due_date,
            mutual_acceptance_date,
            inspection_date,
            appraisal_date,
            final_walkthrough_date,
            possession_date,
            closed_date,
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
// Create Goal
// ----------------------------------------------

export async function CreateGoal(year: number, month: number, income_goal: string, transaction_goal: string, estimated_average_sale_price: string, estimated_average_commission_rate: string): Promise<Goal> {
    const res = await fetch(`${BASE_URL}/goals`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            year,
            month,
            income_goal,
            transaction_goal,
            estimated_average_sale_price,
            estimated_average_commission_rate
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating goal: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Create Smart List
// ----------------------------------------------

export async function CreateSmartList(name: string, description: string): Promise<SmartList> {
    const res = await fetch(`${BASE_URL}/smart-lists`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            description,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating smart list: ${res.statusText}`);
    }

    return res.json();
}


// ----------------------------------------------
// Set Smart List Criteria
// ----------------------------------------------

export async function SetSmartListFilterCriteria(smart_list_id: string, filter_criteria: any): Promise<SmartList> {
    const res = await fetch(`${BASE_URL}/smart-lists/${smart_list_id}/filter`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            filter_criteria,
        }),
    });

    if (!res.ok) {
        toast.error(`Error setting smart list filter criteria: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Update Deal
// ----------------------------------------------

export async function UpdateDeal(deal_id: string, contact_id: string, title: string, price: number, closing_date: string, earnest_money_due_date: string, mutual_acceptance_date: string, inspection_date: string, appraisal_date: string, final_walkthrough_date: string, possession_date: string, closed_date: string, commission: number, commission_split: number, property_address: string, property_city: string, property_state: string, property_zip: string, description: string, stage_id: string): Promise<Deal> {
    const res = await fetch(`${BASE_URL}/deals/${deal_id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            deal_id,
            contact_id,
            title,
            price,
            closing_date,
            earnest_money_due_date,
            mutual_acceptance_date,
            inspection_date,
            appraisal_date,
            final_walkthrough_date,
            possession_date,
            closed_date,
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
        throw new Error(`Error updating deal: ${res.statusText}`);
    }

    return res.json();
}


// ----------------------------------------------
// Create Stage
// ----------------------------------------------

export async function CreateStage(name: string, description: string, client_type: string, order_index: number): Promise<Stage> {
    const res = await fetch(`${BASE_URL}/stages`, {
        method: 'POST',
        credentials: 'include',
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
// Create Contact Log
// ----------------------------------------------

export async function CreateContactLog(contact_id: string, contact_method: string, note: string): Promise<ContactLog> {
    const res = await fetch(`${BASE_URL}/contact-logs`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id,
            contact_method,
            note,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating contact log: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Create Contact Note
// ----------------------------------------------

export async function CreateContactNote(contact_id: string, note: string): Promise<ContactNote> {
    const res = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id,
            note,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating contact note: ${res.statusText}`);
    }

    return res.json();
}
//
// ----------------------------------------------
// Add Tag to Contact
// ----------------------------------------------

export async function AddTagToContact(contactID: string, tagID: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/tags/${tagID}/contact/${contactID}`, {
        method: 'POST',
        credentials: 'include',
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
        credentials: 'include',
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

export async function CreateTag(name: string, description: string): Promise<Tag> {
    const res = await fetch(`${BASE_URL}/tags`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tag_name: name,
            tag_description: description,
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
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Error deleting tag: ${res.statusText}`);
    }
}

// ----------------------------------------------
// Update Stage
// ----------------------------------------------

export async function UpdateStage(stageID: string, name: string, description: string, client_type: string, order_index: number): Promise<Stage> {
    const res = await fetch(`${BASE_URL}/stages/${stageID}`, {
        method: 'PUT',
        credentials: 'include',
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
        toast.error(`Error updating stage: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Delete Stage
// ----------------------------------------------

export async function DeleteStage(stageID: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/stages/${stageID}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error deleting stage: ${res.statusText}`);
    }
}

// ----------------------------------------------
// Update Goal
// ----------------------------------------------

export async function UpdateGoal(goalID: string, year: number, month: number, income_goal: string, transaction_goal: string, estimated_average_sale_price: string, estimated_average_commission_rate: string): Promise<Goal> {
    const res = await fetch(`${BASE_URL}/goals/${goalID}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            year,
            month,
            income_goal,
            transaction_goal,
            estimated_average_sale_price,
            estimated_average_commission_rate
        }),
    });

    if (!res.ok) {
        toast.error(`Error updating goal: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Delete Deal
// ----------------------------------------------

export async function DeleteDeal(deal_id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/deals/${deal_id}`, {
        method: 'DELETE',
        credentials: 'include',
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
// Delete Email
// ----------------------------------------------

export async function DeleteEmail(emailID: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/emails/${emailID}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error deleting email: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// Update Email
// ----------------------------------------------

export async function UpdateEmail(emailID: string, email: string, type: string, isPrimary: boolean): Promise<void> {
    const res = await fetch(`${BASE_URL}/emails/${emailID}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            type,
            is_primary: isPrimary,
        }),
    });

    if (!res.ok) {
        toast.error(`Error updating email: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// Create Email
// ----------------------------------------------

export async function CreateEmail(contactID: string, email: string, type: string, isPrimary: boolean): Promise<void> {
    const res = await fetch(`${BASE_URL}/emails/contact/${contactID}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            type,
            is_primary: isPrimary,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating email: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// Delete Phone Number
// ----------------------------------------------

export async function DeletePhoneNumber(phoneNumberID: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/phone-numbers/${phoneNumberID}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        toast.error(`Error deleting phone number: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// Update Phone Number
// ----------------------------------------------

export async function UpdatePhoneNumber(phoneNumberID: string, phone_number: string, type: string, isPrimary: boolean): Promise<void> {
    const res = await fetch(`${BASE_URL}/phone-numbers/${phoneNumberID}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phone_number,
            type,
            is_primary: isPrimary,
        }),
    });

    if (!res.ok) {
        toast.error(`Error updating phone number: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// Create Phone Number
// ----------------------------------------------

export async function CreatePhoneNumber(contactID: string, phone_number: string, type: string, isPrimary: boolean): Promise<void> {
    const res = await fetch(`${BASE_URL}/phone-numbers/contact/${contactID}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phone_number,
            type,
            is_primary: isPrimary,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating phone number: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// Update Contact
// ----------------------------------------------

export async function UpdateContact(contactID: string, first_name: string, last_name: string, birthdate: string, source: string, status: string, address: string, city: string, state: string, zip_code: string, lender: string, price_range: string, timeframe: string): Promise<Contact> {
    const res = await fetch(`${BASE_URL}/contacts/${contactID}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name,
            last_name,
            birthdate,
            source,
            status,
            address,
            city,
            state,
            zip_code,
            lender,
            price_range,
            timeframe,
        }),
    });

    if (!res.ok) {
        toast.error(`Error updating contact: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Get Organization Members
// ----------------------------------------------

export async function GetOrganizationMembers(orgIDs: string[]): Promise<any[]> {
    console.log('[GetOrganizationMembers] called')
    console.log(
        '[GetOrganizationMembers] orgIDs at call time:',
        JSON.stringify(orgIDs),
        'length:',
        orgIDs.length
    )

    const res = await fetch(`${BASE_URL}/members/organizations`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            org_ids: orgIDs,
        }),
    });

    if (!res.ok) {
        toast.error(`Error fetching organization members: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Add Collaborator to Contact
// ----------------------------------------------

export async function AddCollaboratorToContact(contact_id: string, user_id: string, role: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/collaborators`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_id,
            user_id,
            role,
        }),
    });

    if (!res.ok) {
        toast.error(`Error adding collaborator to contact: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// Remove Collaborator from Contact
// ----------------------------------------------

export async function RemoveCollaboratorFromContact(contactID: string, collaboratorID: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/collaborators/${collaboratorID}/contact/${contactID}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error removing collaborator from contact: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// Mentions
// ----------------------------------------------

export async function SendMentionNotifications(
    contactId: string,
    mentions: MentionData[],
    noteContent: string
): Promise<void> {
    const response = await fetch('/api/notifications/mentions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contactId,
            mentions,
            noteContent
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send mention notifications');
    }
}

// ----------------------------------------------
// Create Notification
// ----------------------------------------------

export async function CreateNotification(user_id: string, type: string, message: string, contact_id?: string, appointment_id?: string, task_id?: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/notifications`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id,
            message,
            type,
            contact_id,
            appointment_id,
            task_id,
        }),
    });

    if (!res.ok) {
        toast.error(`Error creating notification: ${res.statusText}`);
    }

    return;
}


// ----------------------------------------------
// Mark Notification as Read
// ----------------------------------------------

export async function MarkNotificationAsRead(notification_id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/notifications/mark-as-read/${notification_id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error marking notification as read: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// Mark All Notifications as Read
// ----------------------------------------------

export async function MarkAllNotificationsAsRead(): Promise<void> {
    const res = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error marking all notifications as read: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// Delete Notification
// ----------------------------------------------

export async function DeleteNotification(notification_id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/notifications/${notification_id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error deleting notification: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// Get Notifications for User
// ----------------------------------------------

export async function GetNotificationsForUser(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/notifications`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching notifications for user: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Delete Contacts
// ----------------------------------------------

export async function DeleteContacts(contactIds: string[]): Promise<void> {
    const res = await fetch(`${BASE_URL}/contacts/bulk-delete`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contact_ids: contactIds,
        }),
    });

    if (!res.ok) {
        toast.error(`Error deleting contacts: ${res.statusText}`);
    }

    return;
}

// ----------------------------------------------
// Get All Contacts
// ----------------------------------------------

export async function GetAllContacts(limit: string, offset: string): Promise<Contact[]> {
    const res = await fetch(`${BASE_URL}/contacts?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        toast.error(`Error fetching contacts: ${res.statusText}`);
    }

    return res.json();
}

// ----------------------------------------------
// Update Appointment
// ----------------------------------------------

export async function UpdateAppointment(appointment_id: string, contact_id: string, title: string, scheduled_at: string, notes: string, outcome: string, location: string, type: string): Promise<Appointment> {
    const res = await fetch(`${BASE_URL}/appointments/${appointment_id}`, {
        method: 'PUT',
        credentials: 'include',
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
        throw new Error(`Error updating appointment: ${res.statusText}`);
    }

    return res.json();
}
