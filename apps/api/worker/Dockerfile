FROM oven/bun:1
WORKDIR /app

COPY package.json bun.lock ./
COPY . .

RUN bun install

# Worker service (Redis consumer, queue, etc.)
CMD ["bun", "run", "dev"]
