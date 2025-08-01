FROM oven/bun:1.1.13

WORKDIR /app
COPY . .

# Install dependencies if pusher has its own package.json or reuses api's
RUN cd apps/api/pusher
RUN bun install

# Start Pusher logic
CMD ["bun", "apps/api/pusher/index.ts"]
