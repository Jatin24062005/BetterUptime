# apps/frontend/Dockerfile
FROM oven/bun

WORKDIR /app
COPY . .

WORKDIR /app/apps/frontend
RUN bun pm cache clean --all && bun install
RUN bun run  build

EXPOSE 3000
CMD ["bun", "run","dev"]
