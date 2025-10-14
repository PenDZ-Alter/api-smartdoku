# ————————————————————————
# 0️⃣ Builder stage: Install & Generate Prisma Client
# ————————————————————————
FROM oven/bun:1.1.13-slim AS builder
WORKDIR /app

# 1️⃣ Copy dependency list dulu
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# 2️⃣ Copy Prisma folder secara eksplisit
COPY prisma ./prisma

# 3️⃣ Baru copy semua source code
COPY . .

# 4️⃣ Generate Prisma Client
RUN bun run generate:prod

# ————————————————————————
# 1️⃣ Production runtime stage
# ————————————————————————
FROM oven/bun:1.1.13-slim AS production
WORKDIR /app

COPY --from=builder /app ./
COPY .env.production .

ARG APP_ENV=production
ENV NODE_ENV=${APP_ENV}

EXPOSE ${PORT:-3000}

CMD ["sh", "-c", "\
  if [ \"$RUN_MIGRATIONS\" = \"true\" ]; then \
    set -e; \
    bun run migrate:dev; \
    bun run migrate:prod; \
  fi && \
  bun run prod \
"]
