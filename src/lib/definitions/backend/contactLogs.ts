import { NullString, NullTime, NullUUID } from "../nullTypes";

// --------------------------------------------------------------
//    Contact Log Interface
// --------------------------------------------------------------

export interface ContactLog {
    ID: string; // uuid.UUID

    ContactID: NullUUID; // uuid.NullUUID

    ContactMethod: string;

    CreatedBy: NullUUID; // uuid.NullUUID
    CreatedByName: string; // Name of the user who created the log

    Note: NullString; // sql.NullString

    CreatedAt: NullTime; // sql.NullTime
    UpdatedAt: NullTime; // sql.NullTime
}
