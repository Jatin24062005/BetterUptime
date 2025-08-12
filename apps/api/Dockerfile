# apps/api/Dockerfile
FROM oven/bun

WORKDIR /app

# First copy only the files needed for dependency installation
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY apps/api/pusher/package.json ./apps/api/pusher/
COPY apps/api/worker/package.json ./apps/api/worker/

# Install root dependencies first
RUN bun pm cache clean --all && bun install

# Then install API dependencies
WORKDIR /app/apps/api
RUN bun install

# Copy the rest of the files
WORKDIR /app
COPY . .

WORKDIR /app/apps/api
EXPOSE 4000
CMD ["bun", "run", "index.ts"]