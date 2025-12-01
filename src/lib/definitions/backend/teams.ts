import { NullTime, NullUUID } from "../nullTypes";

// --------------------------------------------------------------
//    Teams Interface
// --------------------------------------------------------------

export interface Team {
    ID: string;
    Name: string;
    TeamLeadID: NullUUID;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
}
