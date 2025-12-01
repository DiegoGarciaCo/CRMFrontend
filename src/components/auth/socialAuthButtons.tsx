'use client';

import { SUPPORTED_OAUTH_PROVIDER_DETAILS, SUPPORTED_OAUTH_PROVIDERS } from "@/lib/oAuthProviders";
import { authClient } from "@/lib/auth-client";
import { BetterAuthActionButton } from "./betterAuthActionButton";

export default function SocialAuthButtons() {
    return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
        const Icon = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].Icon;
        return (
            <BetterAuthActionButton key={provider} variant="outline" action={() => {
                return authClient.signIn.social({ provider, callbackURL: "/" });
            }}>
                <Icon />
                {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
            </BetterAuthActionButton>
        );
    }
    );
}
