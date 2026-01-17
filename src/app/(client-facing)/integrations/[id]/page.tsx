"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const integrations = [
    {
        id: "quo",
        name: "Quo",
        description: "Send invoices and sync customers",
        category: "Payments",
        logo: "/logos/quo.svg",
        features: ["Sync customers", "Create invoices", "Track payments"],
        permissions: ["Read customers", "Create invoices", "Read payment status"],
        connected: false,
    },
    {
        id: "stripe",
        name: "Stripe",
        description: "Accept payments and manage subscriptions",
        category: "Payments",
        logo: "/logos/stripe.svg",
        features: ["Accept payments", "Manage subscriptions", "Track invoices"],
        permissions: ["Read payments", "Create subscriptions"],
        connected: true,
    },
    {
        id: "mailchimp",
        name: "Mailchimp",
        description: "Email marketing automation",
        category: "Marketing",
        logo: "/logos/mailchimp.svg",
        features: ["Send campaigns", "Sync contacts", "Track opens"],
        permissions: ["Read contacts", "Send campaigns"],
        connected: false,
    },
];

export default function IntegrationDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [apiKey, setApiKey] = useState("");

    const integration = integrations.find((i) => i.id === id);

    if (!integration) return <div className="p-10">Integration not found.</div>;

    const handleConnect = () => {
        // Placeholder: save API key securely and mark as connected
        alert(`${integration.name} connected with API key: ${apiKey}`);
    };

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <Button variant="link" onClick={() => router.back()} className="mb-6">
                ← Back to Integrations
            </Button>

            <div className="flex items-center gap-6 mb-6">
                <div className="relative w-16 h-16">
                    <Image src={integration.logo} alt={integration.name} fill className="object-contain" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-1">{integration.name}</h1>
                    <p className="text-zinc-500">{integration.description}</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Features</h2>
                <ul className="list-disc list-inside space-y-1">
                    {integration.features.map((f) => (
                        <li key={f}>{f}</li>
                    ))}
                </ul>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Permissions</h2>
                <ul className="list-disc list-inside space-y-1">
                    {integration.permissions.map((p) => (
                        <li key={p}>{p}</li>
                    ))}
                </ul>
            </div>

            {!integration.connected && (
                <Card className="p-6 max-w-md">
                    <CardHeader>
                        <CardTitle>Connect {integration.name}</CardTitle>
                        <CardDescription>Enter your API key to connect</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <input
                            type="text"
                            placeholder="Your API Key"
                            className="w-full border border-zinc-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <Button onClick={handleConnect}>Connect</Button>
                    </CardContent>
                </Card>
            )}

            {integration.connected && (
                <div className="text-green-600 font-medium mt-6">This integration is already connected.</div>
            )}
        </div>
    );
}
