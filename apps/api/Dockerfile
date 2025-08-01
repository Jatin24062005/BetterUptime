# apps/api/Dockerfile
FROM oven/bun

WORKDIR /app
COPY . .

WORKDIR /app/apps/api

RUN bun pm cache clean --all && bun install


EXPOSE 4000
CMD ["bun", "run", "index.ts"]
