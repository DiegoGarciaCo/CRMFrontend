"use client"

import { authClient } from "@/lib/auth-client"
import { BetterAuthActionButton } from "../auth/betterAuthActionButton"


export function SetPasswordButton({ email }: { email: string }) {
    return (
        <BetterAuthActionButton
            variant="outline"
            successMessage="Password reset email sent"
            action={() => {
                return authClient.requestPasswordReset({
                    email,
                    redirectTo: "/auth/reset-password",
                })
            }}
        >
            Send Password Reset Email
        </BetterAuthActionButton>
    )
}
