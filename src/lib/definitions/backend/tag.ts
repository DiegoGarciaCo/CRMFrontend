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

export interface TagLower {
    id: string;                 // uuid.UUID
    name: string;
    description: string;
    userID: string;
    created_at: NullTime;
    updated_at: NullTime;
}

