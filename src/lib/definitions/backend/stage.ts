import { NullString, NullTime, NullInt, NullUUID } from "../nullTypes";

// --------------------------------------------------------------
//    Client type definition
// ----------------------------------------------------------

export type ClientType = "buyer" | "seller";

export interface NullClientType {
    ClientType: ClientType;
    Valid: boolean;
}

// --------------------------------------------------------------
//    Smart List Interface
// --------------------------------------------------------------

export interface Stage {
    ID: string; // uuid.UUID
    Name: string;
    Description: NullString;
    ClientType: ClientType;
    NumberOfDeals: NullInt;
    TotalPotentialIncome: NullInt;
    OrderIndex: number; // int32
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
    OwnerID: NullUUID;
}
