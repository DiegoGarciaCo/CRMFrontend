import { NullString, NullTime, NullUUID, NullInt } from "../nullTypes";

// --------------------------------------------------------------
//    Goal Interface
// --------------------------------------------------------------

export interface Goal {
    ID: string;
    UserID: NullUUID;
    Year: number;
    Month: number;
    IncomeGoal: NullString;
    TransactionGoal: NullInt;
    EstimatedAverageSalePrice: NullString;
    EstimatedAverageCommissionRate: NullString;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
}
