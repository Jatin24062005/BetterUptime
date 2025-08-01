FROM oven/bun:1.1.13

WORKDIR /app
COPY . .

# Only install API dependencies
RUN cd apps/api 
RUN bun install

# Run API server
CMD ["bun", "apps/api/index.ts"]
