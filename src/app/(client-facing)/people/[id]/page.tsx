"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Contact } from "@/lib/definitions/backend/contacts";
import { GetContactByID } from "@/lib/data/backend/contacts";
import { NullString, NullTime } from "@/lib/definitions/nullTypes";

export default function ContactByIDPage() {
    const params = useParams();
    const contactID = params?.id as string; // make sure your route is /people/[id]

    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!contactID) return;

        setLoading(true);
        GetContactByID(contactID)
            .then((data) => {
                setContact(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load contact.");
                setLoading(false);
            });
    }, [contactID]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner className="w-12 h-12" />
            </div>
        );
    }

    if (error || !contact) {
        return (
            <div className="text-center mt-20 text-red-500">
                {error || "Contact not found."}
            </div>
        );
    }

    // Helper to unwrap NullString / NullTime
    const formatString = (value: NullString) => (value.Valid ? value.String : "-");
    const formatDate = (value: NullTime) =>
        value.Valid ? new Date(value.Time).toLocaleDateString() : "-";

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{contact.FirstName} {contact.LastName}</h1>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Basic Info</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Birthdate</Label>
                        <p>{formatDate(contact.Birthdate)}</p>
                    </div>
                    <div>
                        <Label>Status</Label>
                        <p>{formatString(contact.Status)}</p>
                    </div>
                    <div>
                        <Label>Source</Label>
                        <p>{formatString(contact.Source)}</p>
                    </div>
                    <div>
                        <Label>Owner ID</Label>
                        <p>{contact.OwnerID.Valid ? contact.OwnerID.UUID : "-"}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Contact Info</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Address</Label>
                        <p>{formatString(contact.Address)}</p>
                    </div>
                    <div>
                        <Label>City</Label>
                        <p>{formatString(contact.City)}</p>
                    </div>
                    <div>
                        <Label>State</Label>
                        <p>{formatString(contact.State)}</p>
                    </div>
                    <div>
                        <Label>Zip</Label>
                        <p>{formatString(contact.ZipCode)}</p>
                    </div>
                    <div>
                        <Label>Lender</Label>
                        <p>{formatString(contact.Lender)}</p>
                    </div>
                    <div>
                        <Label>Price Range</Label>
                        <p>{formatString(contact.PriceRange)}</p>
                    </div>
                    <div>
                        <Label>Timeframe</Label>
                        <p>{formatString(contact.Timeframe)}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Timestamps</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Created At</Label>
                        <p>{formatDate(contact.CreatedAt)}</p>
                    </div>
                    <div>
                        <Label>Updated At</Label>
                        <p>{formatDate(contact.UpdatedAt)}</p>
                    </div>
                    <div>
                        <Label>Last Contacted</Label>
                        <p>{formatDate(contact.LastContactedAt)}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
