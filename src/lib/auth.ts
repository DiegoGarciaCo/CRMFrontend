import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { admin, apiKey, organization, twoFactor } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { sendDeleteAccountVerificationEmail, sendEmailVerificationEmail, sendOrganizationInviteEmail, sendPasswordResetEmail } from "./data/emails/sendEmails";
import { passkey } from "@better-auth/passkey";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import { STRIPE_PLANS } from "./stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-11-17.clover",
})

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    advanced: {
        database: {
            generateId: false,
        },
        cookiePrefix: "crm",
        crossSubDomainCookies: {
            enabled: true,
            domain: process.env.COOKIE_DOMAIN,
        },
    },
    user: {
        modelName: "users",
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, url, newEmail }) => {
                await sendEmailVerificationEmail({ user: { ...user, email: newEmail }, url });
            }
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }) => {
                await sendDeleteAccountVerificationEmail({ user, url });
            }
        },
    },
    account: {
        modelName: "accounts",
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        resetPasswordTokenExpirationMinutes: 30,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendPasswordResetEmail({ user, url });
        }
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmailVerificationEmail({ user, url });
        }
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24,
        },
    },
    magicLink: {
        enabled: true,
    },
    oauth: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            enabled: true,
        },
    },
    plugins: [
        twoFactor(),
        nextCookies(),
        passkey(),
        admin(),
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
            subscriptions: {
                enabled: true,
                plans: STRIPE_PLANS,
            },
        }),
        organization({
            sendInvitationEmail: async ({ email, organization, inviter, invitation }) => {
                await sendOrganizationInviteEmail({
                    email,
                    organization,
                    inviter: inviter.user,
                    invitation,
                });
            },
        }),
        apiKey(),
    ],
});
