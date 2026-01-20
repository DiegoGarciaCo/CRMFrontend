"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
    CreateContactPhoneNumberInput,
} from "@/lib/definitions/backend/phoneNumbers";
import {
    CreateContactEmailInput,
} from "@/lib/definitions/backend/emails";
import { CreateContact } from "@/lib/data/backend/clientCalls";

export default function CreateContactForm({
    onSuccess,
}: {
    onSuccess: () => void;
}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthdate, setBirthdate] = useState("");

    const [source, setSource] = useState("");
    const [status, setStatus] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [stateVal, setStateVal] = useState("");
    const [zipCode, setZipCode] = useState("");

    const [lender, setLender] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [timeframe, setTimeframe] = useState("");

    const [phoneNumbers, setPhoneNumbers] =
        useState<CreateContactPhoneNumberInput[]>([
            { number: "", type: "mobile", is_primary: true },
        ]);

    const [emails, setEmails] = useState<CreateContactEmailInput[]>([
        { email: "", type: "personal", is_primary: true },
    ]);

    const addPhoneNumber = () =>
        setPhoneNumbers((prev) => [
            ...prev,
            { number: "", type: "mobile", is_primary: false },
        ]);

    const addEmail = () =>
        setEmails((prev) => [
            ...prev,
            { email: "", type: "personal", is_primary: false },
        ]);

    const updatePhoneNumber = (index: number, field: string, value: any) => {
        setPhoneNumbers((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const updateEmail = (index: number, field: string, value: any) => {
        setEmails((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSubmit = async () => {
        try {
            await CreateContact(
                firstName,
                lastName,
                phoneNumbers,
                emails,
                birthdate,
                source,
                status,
                address,
                city,
                stateVal,
                zipCode,
                lender,
                priceRange,
                timeframe,
            );

            toast.success("Contact created!");
            onSuccess();
        } catch (err) {
            toast.error("Failed to create contact.");
        }
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Section spacing improved */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>First Name</Label>
                    <Input className="mt-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                    <Label>Last Name</Label>
                    <Input className="mt-2" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
            </div>

            <div>
                <Label>Birthdate</Label>
                <Input className="mt-2" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
            </div>

            <div>
                <Label>Address</Label>
                <Input className="mt-2" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <Label>City</Label>
                    <Input className="mt-2" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>

                <div>
                    <Label>State</Label>
                    <Input className="mt-2" value={stateVal} onChange={(e) => setStateVal(e.target.value)} />
                </div>

                <div>
                    <Label>Zip Code</Label>
                    <Input className="mt-2" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                </div>
            </div>

            <div>
                <Label>Phone Numbers</Label>
                <div className="space-y-3 mt-2">
                    {phoneNumbers.map((pn, i) => (
                        <div key={i} className="flex gap-3">
                            <Input
                                className="mt-2"
                                placeholder="Number"
                                value={pn.number}
                                onChange={(e) => updatePhoneNumber(i, "number", e.target.value)}
                            />
                            <Input

                                placeholder="Type"
                                className="w-32"
                                value={pn.type}
                                onChange={(e) => updatePhoneNumber(i, "type", e.target.value)}
                            />
                        </div>
                    ))}
                    <Button variant="secondary" size="sm" onClick={addPhoneNumber}>
                        + Add Phone
                    </Button>
                </div>
            </div>

            <div>
                <Label>Emails</Label>
                <div className="space-y-3 mt-2">
                    {emails.map((em, i) => (
                        <div key={i} className="flex gap-3">
                            <Input
                                className="mt-2"
                                placeholder="Email"
                                value={em.email}
                                onChange={(e) => updateEmail(i, "email", e.target.value)}
                            />
                            <Input
                                placeholder="Type"
                                className="w-32"
                                value={em.type}
                                onChange={(e) => updateEmail(i, "type", e.target.value)}
                            />
                        </div>
                    ))}
                    <Button variant="secondary" size="sm" onClick={addEmail}>
                        + Add Email
                    </Button>
                </div>
            </div>

            {/* Additional fields */}
            <div className="space-y-4">
                <div>
                    <Label>Source</Label>
                    <Input className="mt-2" value={source} onChange={(e) => setSource(e.target.value)} />
                </div>

                <div>
                    <Label>Status</Label>
                    <Input className="mt-2" value={status} onChange={(e) => setStatus(e.target.value)} />
                </div>

                <div>
                    <Label>Lender</Label>
                    <Input className="mt-2" value={lender} onChange={(e) => setLender(e.target.value)} />
                </div>

                <div>
                    <Label>Price Range</Label>
                    <select
                        className="w-full rounded-md border px-2 py-2 text-sm mt-2"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                    >

                        <option value="">None</option>
                        <option value="Under $250k">Under 250k</option>
                        <option value="$250k - $499k">$250k-$499k</option>
                        <option value="$500k - $749k">$500k-$749k</option>
                        <option value="$750k - $1M">$750k-$1M</option>
                        <option value="+$1M">+$1M</option>
                    </select>
                </div>

                <div>
                    <Label>Timeframe</Label>
                    <select
                        value={timeframe}
                        onChange={(e) =>
                            setTimeframe(e.target.value)
                        }
                        className="w-full rounded-md border px-2 py-2 text-sm mt-2"
                    >
                        <option value="">None</option>
                        <option value="Immediate">Immediate</option>
                        <option value="1–3 Months">1–3 Months</option>
                        <option value="3–6 Months">3–6 Months</option>
                        <option value="6+ Months">6+ Months</option>
                    </select>
                </div>
            </div>

            <Button className="w-full" onClick={handleSubmit}>
                Create Contact
            </Button>
        </div>
    );
}
