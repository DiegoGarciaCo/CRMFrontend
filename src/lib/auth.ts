import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { admin, apiKey, organization, twoFactor } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { sendDeleteAccountVerificationEmail, sendEmailVerificationEmail, sendOrganizationInviteEmail, sendPasswordResetEmail } from "./data/emails/sendEmails";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import { STRIPE_PLANS } from "./stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
})
//
// Configure pool for Neon's auto-suspend behavior
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Reduce pool size for free tier
    idleTimeoutMillis: 60000, // Close idle connections after 1 min
    connectionTimeoutMillis: 30000, // 30 second timeout for wakeup
    query_timeout: 30000, // 30 second query timeout
    // Allow time for Neon to wake up
    application_name: 'crm-app',
});

// Add error handler
pool.on('error', (err) => {
    console.error('Unexpected database pool error', err);
});

export const auth = betterAuth({
    database: pool,
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
