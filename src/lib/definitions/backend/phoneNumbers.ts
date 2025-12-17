import { NullTime } from '../nullTypes';

// ------------------------------
// Phone Numbers Interface
// ------------------------------

export interface PhoneNumber {
    id: string; // uuid.UUID
    contact_id: string;
    phone_number: string;
    type: string;
    is_primary: boolean;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
}

export interface CreateContactPhoneNumberInput {
    number: string;
    type: string;
    is_primary: boolean;
}

export interface ContactsWithPhoneNumbers {
    id: string; // uuid.UUID
    contact_id: string;
    phone_number: string;
    type: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}
