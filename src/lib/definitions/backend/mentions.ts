export interface MentionData {
    id: string;
    label: string;
}

export interface Notification {
    ID: string;
    UserID: string;
    Type: string;
    Message: string;
    ContactID: string;
    Read: boolean;
    CreatedAt: Date;
}
