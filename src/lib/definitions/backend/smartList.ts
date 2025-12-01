import { NullString, NullTime, NullUUID } from "../nullTypes";

// --------------------------------------------------------------
//   Null Sort Order Type
// --------------------------------------------------------------

export type SortOrder = "asc" | "desc";

export interface NullSortOrder {
    SortOrder: SortOrder;
    Valid: boolean;
}

// --------------------------------------------------------------
//    Smart List Interface
// --------------------------------------------------------------

export interface SmartList {
    ID: string; // uuid.UUID
    Name: string;
    Description: NullString;
    UserID: NullUUID;
    TeamID: NullUUID;
    FilterCriteria: any; // json.RawMessage → arbitrary JSON
    SortBy: NullString;
    SortOrder: NullSortOrder;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
}
