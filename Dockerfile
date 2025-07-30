# Base image Bun
FROM oven/bun:1.1.13-slim AS base
WORKDIR /app

# Install mysql-client + dependencies
RUN apt-get update && apt-get install -y \
    default-mysql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy file dependensi
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy semua file
COPY . .

# ===== PRODUCTION STAGE =====
FROM oven/bun:1.1.13-slim AS production
WORKDIR /app

# Install mysql-client untuk production
RUN apt-get update && apt-get install -y \
    default-mysql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy dari stage base
COPY --from=base /app /app

# Set environment variables
ARG APP_ENV=production
ENV NODE_ENV=${APP_ENV}

# Copy env files
COPY prisma/.env ./prisma/.env
COPY .env.${APP_ENV} ./.env

# Generate Prisma client
RUN bun run db:generate

EXPOSE ${PORT:-3000}

# Entrypoint dengan migrasi opsional
CMD ["sh", "-c", "if [ \"$RUN_MIGRATIONS\" = \"true\" ]; then bun run migrate:prod; fi && bun run prod"]