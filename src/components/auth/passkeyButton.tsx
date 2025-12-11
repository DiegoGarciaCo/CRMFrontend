"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { BetterAuthActionButton } from "./betterAuthActionButton"

export function PasskeyButton() {
    const router = useRouter()
    const { refetch } = authClient.useSession()

    useEffect(() => {
        authClient.signIn.passkey(
            { autoFill: true },
            {
                onSuccess() {
                    refetch()
                    router.push("/")
                },
            }
        )
    }, [router, refetch])

    return (
        <BetterAuthActionButton
            variant="outline"
            className="w-full cursor-pointer"
            action={() =>
                authClient.signIn.passkey(undefined, {
                    onSuccess() {
                        refetch()
                        router.push("/")
                    },
                })
            }
        >
            Use Passkey
        </BetterAuthActionButton>
    )
}
