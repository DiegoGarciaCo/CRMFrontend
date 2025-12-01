import { NullBool, NullString, NullTime, NullUUID } from '../nullTypes';

// ------------------------------
// Phone Numbers Interface
// ------------------------------

export interface PhoneNumber {
    ID: string; // uuid.UUID
    ContactID: NullUUID;
    PhoneNumber: string;
    Type: NullString;
    IsPrimary: NullBool;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
}

export interface CreateContactPhoneNumberInput {
    number: string;
    type: string;
    is_primary: boolean;
}
