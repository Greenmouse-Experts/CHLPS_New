FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
# react-popper has not widened its peer range for React 19 yet.
RUN npm ci --legacy-peer-deps

FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISH_KEY
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_STRIPE_PUBLISH_KEY=${NEXT_PUBLIC_STRIPE_PUBLISH_KEY}
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
