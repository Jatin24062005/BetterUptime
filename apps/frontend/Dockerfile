# Base: Bun for building Next.js
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
COPY . .

RUN bun install
RUN bun run build

# Runtime (smaller)
FROM oven/bun:1
WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3000
CMD ["bun", "run", "dev"]
