import { NullString, NullTime, NullUUID } from "../nullTypes";

// ------------------------------
// Client Interface
// ------------------------------
export interface Contact {
    ID: string; // uuid.UUID

    FirstName: string;
    LastName: string;

    Birthdate: NullTime; // sql.NullTime

    Source: NullString;  // sql.NullString
    Status: NullString;  // sql.NullString
    Address: NullString; // sql.NullString
    City: NullString;    // sql.NullString
    State: NullString;   // sql.NullString
    ZipCode: NullString; // sql.NullString

    Lender: NullString;      // sql.NullString
    PriceRange: NullString;  // sql.NullString
    Timeframe: NullString;   // sql.NullString

    OwnerID: NullUUID; // uuid.NullUUID

    CreatedAt: NullTime;       // sql.NullTime
    UpdatedAt: NullTime;       // sql.NullTime
    LastContactedAt: NullTime; // sql.NullTime
}

// ------------------------------
// Create Contact Interface
// ------------------------------

export interface CreateContactInput {
    first_name: string;
    last_name: string;
    birthdate: string;
    phone_numbers: {
        number: string;
        type: string;
        is_primary: boolean;
    }[];
    emails: {
        email: string;
        type: string;
        is_primary: boolean;
    }[];
    source: string;
    status: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    lender: string;
    price_range: string;
    timeframe: string;
    owner_id: string;
}

// ------------------------------
// Contact with Details Interface
// ------------------------------

export interface ContactWithDetails {
    ID: string; // uuid.UUID

    FirstName: string;
    LastName: string;

    Birthdate: NullTime; // sql.NullTime

    Source: NullString;  // sql.NullString
    Status: NullString;  // sql.NullString
    Address: NullString; // sql.NullString
    City: NullString;    // sql.NullString
    State: NullString;   // sql.NullString
    ZipCode: NullString; // sql.NullString

    Lender: NullString;      // sql.NullString
    PriceRange: NullString;  // sql.NullString
    Timeframe: NullString;   // sql.NullString

    OwnerID: NullUUID; // uuid.NullUUID

    CreatedAt: NullTime;       // sql.NullTime
    UpdatedAt: NullTime;       // sql.NullTime
    LastContactedAt: NullTime; // sql.NullTime
    Emails: string; // JSON stringified Email[]
    PhoneNumbers: string; // JSON stringified PhoneNumber[]
    Tags: string; // JSON stringified Tag[]
}

export interface ContactsBySourceRow {
    Source: NullString;
    ContactCount: number;
}
