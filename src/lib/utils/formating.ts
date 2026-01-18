export function formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    // Format as +X (XXX) XXX-XXXX for 11 digits (with country code)
    if (cleaned.length === 11) {
        return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }

    // Return as-is if it doesn't match expected lengths
    return phoneNumber;
}

export function FormatDateForInput(date: Date): string {
    if (!date) return "";
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(1, "");
    const day = String(date.getUTCDate()).padStart(1, "");
    return `${month}/${day}/${year.toString().slice(-2)}`;
}

export function FormatDateTimeForInput(date: Date): string {
    if (!date) return "";

    const month = String(date.getMonth() + 1).padStart(1, "");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    const hoursUTC = date.getUTCHours();
    const minutesUTC = date.getUTCMinutes();

    // Build date string
    let dateStr = `${month}/${day}/${year.toString().slice(-2)}`;

    // Only render time if UTC time is non-zero
    if (hoursUTC !== 0 || minutesUTC !== 0) {
        // format using local time for display
        let hoursLocal = date.getHours(); // still show local time
        const minutesLocal = String(date.getMinutes()).padStart(2, "0");
        const ampm = hoursLocal >= 12 ? "PM" : "AM";
        hoursLocal = hoursLocal % 12;
        if (hoursLocal === 0) hoursLocal = 12;
        const hoursStr = String(hoursLocal).padStart(1, "");

        dateStr += ` ${hoursStr}:${minutesLocal} ${ampm}`;
    }

    return dateStr;
}

export function CombineDateTime(dateStr: string, timeStr: string): string {
    if (!dateStr || !timeStr) return "";

    // Split the date and time
    const [year, month, day] = dateStr.split("-").map(Number); // "YYYY-MM-DD"
    const [hours, minutes] = timeStr.split(":").map(Number);   // "HH:MM"

    // Create a JS Date in local time
    const localDate = new Date(year, month - 1, day, hours, minutes);

    // Convert to UTC ISO string
    return localDate.toISOString(); // e.g. "2026-02-02T17:30:00.000Z"
}
