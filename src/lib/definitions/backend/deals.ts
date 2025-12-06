import { NullString, NullTime, NullInt } from "../nullTypes";

// --------------------------------------------------------------
//    Contact Log Interface
// --------------------------------------------------------------

export interface Deal {
    ID: string; // uuid.UUID
    ContactID: string;
    AssignedToID: string;
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
    StageID: string;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
    ClosedDate: NullTime;
}
