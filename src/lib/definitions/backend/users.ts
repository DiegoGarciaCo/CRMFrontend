import { NullTime, NullUUID } from "../nullTypes";

// --------------------------------------------------------------
//    User Interface
// --------------------------------------------------------------

export interface User {
    ID: string;
    Username: string;
    Email: string;
    PasswordHash: string;
    TeamID: NullUUID;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
}
