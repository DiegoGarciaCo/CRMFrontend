import { NullString, NullTime, NullUUID } from "../nullTypes";

// --------------------------------------------------------------
//    Contact Log Interface
// --------------------------------------------------------------

export interface ContactLog {
    ID: string; // uuid.UUID

    ContactID: NullUUID; // uuid.NullUUID

    ContactMethod: string;

    CreatedBy: NullUUID; // uuid.NullUUID

    Note: NullString; // sql.NullString

    CreatedAt: NullTime; // sql.NullTime
    UpdatedAt: NullTime; // sql.NullTime
}
