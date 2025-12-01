import { StripePlan } from '@better-auth/stripe';

export const STRIPE_PLANS = [
    {
        name: "Individual",
        priceId: process.env.STRIPE_PRICE_ID_INDIVIDUAL!,
    },
    {
        name: "Team",
        priceId: process.env.STRIPE_PRICE_ID_TEAM!,
    },
] as const satisfies StripePlan[];

export const PLAN_TO_PRICE: Record<string, number> = {
    "Individual": 35,
    "Team": 25,
};
