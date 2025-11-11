# ————————————————————————
# 0️⃣ Builder stage: Install & Generate Prisma Client
# ————————————————————————
FROM oven/bun:1.1.13-slim AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma

COPY . .

RUN bun run generate:prod

# ————————————————————————
# 1️⃣ Production runtime stage
# ————————————————————————
FROM oven/bun:1.1.13-slim AS production
WORKDIR /app

# Install dependencies (libreoffice + fonts)
RUN apt-get update && apt-get install -y \
    libreoffice \
    fonts-dejavu \
    fonts-liberation \
    fonts-noto-core \
    fonts-noto-cjk \
    locales \
 && locale-gen en_US.UTF-8 id_ID.UTF-8 \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app ./
COPY .env.production .

ARG APP_ENV=production
ENV NODE_ENV=${APP_ENV}
ENV LANG=id_ID.UTF-8
ENV LC_ALL=id_ID.UTF-8

EXPOSE ${PORT:-3000}

CMD ["sh", "-c", "\
  if [ \"$RUN_MIGRATIONS\" = \"true\" ]; then \
    set -e; \
    bun run migrate; \
    bun run migrate:prod; \
  fi && \
  bun run prod \
"]
