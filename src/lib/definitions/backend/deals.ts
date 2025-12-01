import { NullString, NullTime, NullUUID, NullInt } from "../nullTypes";

// --------------------------------------------------------------
//    Contact Log Interface
// --------------------------------------------------------------

export interface Deal {
    ID: string; // uuid.UUID
    ContactID: NullUUID;
    AssignedToID: NullUUID;
    Title: string;
    Price: number; // int32
    ClosingDate: NullTime;
    EarnestMoneyDueDate: NullTime;
    MutualAcceptanceDate: NullTime;
    InspectionDate: NullTime;
    AppraisalDate: NullTime;
    FinalWalkthroughDate: NullTime;
    PossessionDate: NullTime;
    Commission: NullInt; // sql.NullInt32
    CommissionSplit: NullInt;
    PropertyAddress: NullString;
    PropertyCity: NullString;
    PropertyState: NullString;
    PropertyZipCode: NullString;
    Description: NullString;
    StageID: NullUUID;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
}
