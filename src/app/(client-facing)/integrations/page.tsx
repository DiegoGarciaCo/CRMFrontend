"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Plug, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const integrations = [
    {
        id: "quo",
        name: "Quo",
        description: "Send invoices and sync customers",
        category: "Payments",
        logo: "/logos/quo.svg",
        connected: false,
    },
    {
        id: "stripe",
        name: "Stripe",
        description: "Accept payments and manage subscriptions",
        category: "Payments",
        logo: "/logos/stripe.svg",
        connected: true,
    },
    {
        id: "mailchimp",
        name: "Mailchimp",
        description: "Email marketing automation",
        category: "Marketing",
        logo: "/logos/mailchimp.svg",
        connected: false,
    },
    {
        id: "openai",
        name: "OpenAI",
        description: "AI automation and assistants",
        category: "AI",
        logo: "/logos/openai.svg",
        connected: false,
    },
];

export default function IntegrationsPage() {
    const [search, setSearch] = useState("");

    const filtered = integrations.filter((app) =>
        app.name.toLowerCase().includes(search.toLowerCase())
    );

    const categories = Array.from(new Set(filtered.map((i) => i.category)));

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-bold mb-2">Integrations</h1>
                <p className="text-zinc-500">Connect your CRM with your favorite tools.</p>
            </div>

            {/* Search */}
            <div className="relative mb-12 max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search integrations..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div className="space-y-12">
                {categories.map((category) => (
                    <div key={category}>
                        <h2 className="text-2xl font-semibold mb-6">{category}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered
                                .filter((app) => app.category === category)
                                .map((app) => (
                                    <Card key={app.id} className="p-6 hover:shadow-md transition">
                                        <CardHeader className="flex items-center gap-4 mb-4">
                                            <div className="relative w-12 h-12">
                                                <Image src={app.logo} alt={app.name} fill className="object-contain" />
                                            </div>
                                            <div>
                                                <CardTitle>{app.name}</CardTitle>
                                                <CardDescription>{app.description}</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex items-center justify-between">
                                            {app.connected ? (
                                                <div className="flex items-center gap-2 text-green-600 font-medium">
                                                    <CheckCircle className="w-5 h-5" /> Connected
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-zinc-400 font-medium">
                                                    <Plug className="w-5 h-5" /> Not connected
                                                </div>
                                            )}
                                            <Link href={`/integrations/${app.id}`}>
                                                <Button>{app.connected ? "Manage" : "Connect"}</Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
