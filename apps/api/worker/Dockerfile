FROM oven/bun

WORKDIR /app
COPY . .

WORKDIR /app/apps/api/worker

RUN bun pm cache clean --all && bun install


CMD ["bun", "run", "index.ts"]
