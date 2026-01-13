# syntax=docker/dockerfile:1
FROM node:20-slim AS base

# Install dependencies
FROM base AS deps
RUN apt-get update && apt-get install -y \
        openssl \
        ca-certificates \
        && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN npm ci

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Use BuildKit secret mounts to pass env variables at build-time
RUN --mount=type=secret,id=BASE_URL,env=BASE_URL \
    --mount=type=secret,id=BETTER_AUTH_SECRET,env=BETTER_AUTH_SECRET \
    --mount=type=secret,id=BETTER_AUTH_URL,env=BETTER_AUTH_URL \
    --mount=type=secret,id=NEXT_PUBLIC_BASE_URL,env=NEXT_PUBLIC_BASE_URL \
    --mount=type=secret,id=NEXT_PUBLIC_BETTER_AUTH_URL,env=NEXT_PUBLIC_BETTER_AUTH_URL \
    --mount=type=secret,id=GOOGLE_CLIENT_ID,env=GOOGLE_CLIENT_ID \
    --mount=type=secret,id=GOOGLE_CLIENT_SECRET,env=GOOGLE_CLIENT_SECRET \
    --mount=type=secret,id=APPLE_CLIENT_ID,env=APPLE_CLIENT_ID \
    --mount=type=secret,id=APPLE_CLIENT_SECRET,env=APPLE_CLIENT_SECRET \
    --mount=type=secret,id=APPLE_APP_BUNDLE_IDENTIFIER,env=APPLE_APP_BUNDLE_IDENTIFIER \
    --mount=type=secret,id=POSTMARK_SERVER_TOKEN,env=POSTMARK_SERVER_TOKEN \
    --mount=type=secret,id=POSTMARK_FROM_EMAIL,env=POSTMARK_FROM_EMAIL \
    --mount=type=secret,id=DATABASE_URL,env=DATABASE_URL \
    --mount=type=secret,id=STRIPE_WEBHOOK_SECRET,env=STRIPE_WEBHOOK_SECRET \
    --mount=type=secret,id=STRIPE_SECRET_KEY,env=STRIPE_SECRET_KEY \
    --mount=type=secret,id=COOKIE_DOMAIN,env=COOKIE_DOMAIN \
    sh -c "npm run build"

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create writable directory for better-auth or other libs that need /etc/lrt
RUN mkdir -p /tmp/lrt && chmod 777 /tmp/lrt

COPY --from=builder /app/public ./public

RUN useradd -r -u 1001 -g root ghost

COPY --from=builder --chown=ghost:ghost /app/.next/standalone ./
COPY --from=builder --chown=ghost:ghost /app/.next/static ./.next/static

USER ghost

EXPOSE 3010
ENV PORT=3010
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
