import { NullTime, NullUUID } from "../nullTypes";

// --------------------------------------------------------------
//    Contact Log Interface
// --------------------------------------------------------------

export interface ContactNote {
    ID: string; // uuid.UUID
    ContactID: NullUUID; // uuid.NullUUID
    Note: string;
    CreatedAt: NullTime; // sql.NullTime
    UpdatedAt: NullTime; // sql.NullTime
    CreatedBy: NullUUID; // uuid.NullUUID
}
