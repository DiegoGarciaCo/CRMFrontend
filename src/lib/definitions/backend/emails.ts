import { NullTime } from "../nullTypes";

// --------------------------------------------------------------
//   Email Interface
// --------------------------------------------------------------

export interface Email {
    id: string; // uuid.UUID
    contact_id: string;
    email_address: string;
    type: string;
    is_primary: boolean;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
}

export interface CreateContactEmailInput {
    email: string;
    type: string;
    is_primary: boolean;
}
