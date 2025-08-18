FROM oven/bun:1 AS base
WORKDIR /app

# Copy root configs
COPY package.json bun.lock turbo.json ./

# Copy workspace manifests
COPY apps/api/package.json ./apps/api/
COPY apps/api/pusher/package.json ./apps/api/pusher/
COPY apps/api/worker/package.json ./apps/api/worker/
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/redisStream/package.json ./packages/redisStream/
COPY packages/store/package.json ./packages/store/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install deps (workspace aware)
RUN bun install

# Copy full source AFTER install
COPY . .

WORKDIR /app/packages/store
RUN bunx prisma generate

# ========================
# API service
FROM base AS api
WORKDIR /app/apps/api
CMD ["bun", "run", "dev"]

# Worker service
FROM base AS worker
WORKDIR /app/apps/api/worker
CMD ["bun", "run", "dev"]

# Pusher service
FROM base AS pusher
WORKDIR /app/apps/api/pusher
CMD ["bun", "run", "dev"]

# Frontend service
FROM base AS frontend
WORKDIR /app/apps/frontend
CMD ["bun", "run", "dev"]
Expose 3000



