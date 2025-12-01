import { NullString, NullTime, NullUUID } from "../nullTypes";

// --------------------------------------------------------------
//    Smart List Interface
// --------------------------------------------------------------

export interface Tag {
    ID: string;                 // uuid.UUID
    Name: string;
    Description: NullString;
    UserID: NullUUID;
    TeamID: NullUUID;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
}
