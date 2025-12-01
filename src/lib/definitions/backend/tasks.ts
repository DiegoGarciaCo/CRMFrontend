import { NullString, NullTime, NullUUID } from "../nullTypes";

// --------------------------------------------------------------
//    Task Priority Type
// --------------------------------------------------------------

export type TaskPriority = "low" | "normal" | "high";

export interface NullTaskPriority {
    TaskPriority: TaskPriority;
    Valid: boolean;
}

// --------------------------------------------------------------
//    Task Status Type
// --------------------------------------------------------------

export type TaskStatus = "pending" | "completed" | "cancelled";

export interface NullTaskStatus {
    TaskStatus: TaskStatus;
    Valid: boolean;
}

// --------------------------------------------------------------
//    Task Type
// ----------------------------------------------------------

export type TaskType =
    | "call"
    | "email"
    | "follow-up"
    | "text"
    | "showing"
    | "closing"
    | "open-house"
    | "thank-you";

export interface NullTaskType {
    TaskType: TaskType;
    Valid: boolean;
}

// --------------------------------------------------------------
//    Task Interface
// --------------------------------------------------------------


export interface Task {
    ID: string; // uuid.UUID
    ContactID: NullUUID;
    AssignedToID: NullUUID;
    Title: string;
    Type: NullTaskType;
    Date: NullTime;
    Status: NullTaskStatus;
    Priority: NullTaskPriority;
    Note: NullString;
    CreatedAt: NullTime;
    UpdatedAt: NullTime;
}
