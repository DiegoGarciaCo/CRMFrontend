import {
    twoFactorClient,
    inferAdditionalFields,
    adminClient,
    organizationClient,
    apiKeyClient
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { auth } from "./auth"
import { passkeyClient } from "@better-auth/passkey/client"
import { stripeClient } from "@better-auth/stripe/client"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    plugins: [inferAdditionalFields<typeof auth>(),
    passkeyClient(),
    apiKeyClient(),
    adminClient(),
    organizationClient(),
    stripeClient({
        subscription: true,
    }),
    twoFactorClient({
        onTwoFactorRedirect: () => {
            window.location.href = "/auth/2fa"
        }
    })],
    baseURL: "http://localhost:3000"
})
