# apps/frontend/Dockerfile
FROM oven/bun

WORKDIR /app
COPY . .

RUN bun install
RUN bun run build

EXPOSE 3000
CMD ["bun", "run","dev"]
