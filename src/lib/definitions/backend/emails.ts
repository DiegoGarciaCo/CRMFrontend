import { NullString, NullTime, NullUUID, NullBool } from "../nullTypes";

// --------------------------------------------------------------
//   Email Interface
// --------------------------------------------------------------

export interface Email {
    ID: string; // uuid.UUID
    ContactID: NullUUID;
    EmailAddress: string;
    Type: NullString;
    IsPrimary: NullBool;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
}

export interface CreateContactEmailInput {
    email: string;
    type: string;
    is_primary: boolean;
}
