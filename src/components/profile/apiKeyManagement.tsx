"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { Copy } from "lucide-react"

export function APIKeyManagement({ apiKeys }: { apiKeys: any[] }) {
    const [name, setName] = useState("")
    const [newKey, setNewKey] = useState<string | null>(null)

    async function createKey() {
        if (!name.trim()) return

        const { data, error } = await authClient.apiKey.create({
            name: name.trim(),
            prefix: "crm"
        })
        if (error) {
            toast.error("Error creating API Key")
            return
        }

        setNewKey(data?.key || null)
        toast.success("API Key created!")
    }

    async function revokeKey(id: string) {
        const { data, error } = await authClient.apiKey.delete({
            keyId: id
        })
        if (error) {
            toast.error("Error revoking API Key")
            return
        } else if (data?.success) {
            toast.success("API Key revoked!")
            window.location.reload()
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Key name (e.g., My App Server)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button onClick={createKey}>Create</Button>
            </div>

            {newKey && (
                <NewApiKeyCard newKey={newKey} />
            )}

            <div className="space-y-2">
                {apiKeys.map((k) => (
                    <Card key={k.id} className="p-4 flex justify-between">
                        <div>
                            <p className="font-medium">{k.name}</p>
                            <p className="text-sm text-gray-600">
                                Key: {k.keyPreview}••••••••
                            </p>
                        </div>

                        <Button
                            variant="destructive"
                            disabled={k.revoked}
                            onClick={() => revokeKey(k.id)}
                        >
                            {k.revoked ? "Revoked" : "Revoke"}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function NewApiKeyCard({ newKey }: { newKey: string }) {
    if (!newKey) return null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(newKey);
        toast.success("Copied!");
    };

    return (
        <Card
            className="p-4 bg-yellow-50 border-yellow-300 cursor-pointer hover:bg-yellow-100 transition"
            onClick={handleCopy}
        >
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="font-medium">Your new API key:</p>
                    <code className="block p-2 bg-white rounded border text-sm break-all">
                        {newKey}
                    </code>
                    <p className="text-sm text-red-500">
                        This key will only be shown once — copy it now.
                    </p>
                </div>

                <Copy className="w-5 h-5 text-gray-700 mt-1" />
            </div>
        </Card>
    );
}
