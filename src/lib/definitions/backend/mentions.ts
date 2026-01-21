import { NullBool, NullString, NullTime } from "../nullTypes";

export interface MentionData {
    id: string;
    label: string;
}

export interface Notification {
    ID: string;
    UserID: string;
    Type: string;
    Message: string;
    ContactID: string
    AppointmentID: NullString;
    TaskID: NullString;
    Read: NullBool;
    CreatedAt: NullTime;
}
