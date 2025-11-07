FROM oven/bun:1
WORKDIR /app

COPY package.json bun.lock ./
COPY . .

RUN bun install

EXPOSE 3001
CMD ["bun", "run", "dev"]
