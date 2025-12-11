export const STRIPE_PLANS = [
    {
        id: "tier-individual",
        name: "Individual",
        priceId: process.env.STRIPE_INDIVIDUAL_PRICE_ID!,
        description: "Perfect for individual creators getting started.",
        href: "/auth/login?register=true&plan=Individual",
        priceMonthly: 39,
        features: [
            "5 products",
            "Up to 1,000 subscribers",
            "Basic analytics",
            "48-hour support response time",
        ],
        trialDays: 14,
    },
    {
        id: "tier-team",
        name: "Team",
        priceId: process.env.STRIPE_TEAM_PRICE_ID!,
        description: "Ideal for teams and businesses looking to grow.",
        href: "/auth/login?register=true&plan=Team",
        priceMonthly: 29,
        features: [
            "Unlimited products",
            "Unlimited subscribers",
            "Advanced analytics",
            "1-hour, dedicated support response time",
            "Marketing automations",
        ],
    },
]

export const PLAN_TO_PRICE: Record<string, number> = {
    Individual: 39,
    Team: 29,
}

export interface StripePlan {
    id: string;
    name: string;
    priceId: string;
    description: string;
    href: string;
    priceMonthly: number;
    features: string[];
    trialDays?: number;
}
