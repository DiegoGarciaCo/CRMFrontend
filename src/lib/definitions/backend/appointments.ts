import { NullString, NullTime, NullUUID } from "../nullTypes";
// --------------------------------------------------------------
//    Appointment Outcomes
// --------------------------------------------------------------
export type AppointmentOutcome =
    | "no-outcome"
    | "no"
    | "yes"
    | "rescheduled"
    | "cancelled"
    | "no-show";

export interface NullAppointmentOutcome {
    AppointmentOutcome: AppointmentOutcome
    Valid: boolean;
}

// --------------------------------------------------------------
//     Appointment Types
// --------------------------------------------------------------

export type AppointmentType =
    | "Listing-appointment"
    | "Buyer-appointment"
    | "no-type";

export interface NullAppointmentType {
    AppointmentType: AppointmentType
    Valid: boolean;
}

// --------------------------------------------------------------
//    Appointment Interface
// --------------------------------------------------------------
export interface Appointment {
    ID: string; // uuid.UUID

    ContactID: NullUUID;        // uuid.NullUUID
    AssignedToID: NullUUID;     // uuid.NullUUID

    Title: string;

    ScheduledAt: string;        // time.Time (ISO string)

    Location: NullString;       // sql.NullString

    Type: NullAppointmentType;                // custom null wrapper
    Outcome: NullAppointmentOutcome;          // custom null wrapper

    Note: NullString;           // sql.NullString

    CreatedAt: NullTime;        // sql.NullTime
    UpdatedAt: NullTime;        // sql.NullTime
}
