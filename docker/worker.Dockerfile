FROM oven/bun:1.1.13

WORKDIR /app
COPY . .

# Install worker dependencies (usually shared with api)
RUN cd apps/api/worker
Run bun install

# Run the Redis stream consumer
CMD ["bun", "apps/api/worker/index.ts"]
