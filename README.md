# api-smartdoku
An API Endpoint for DPKPCK to manage apps for SmartDoku.

## Tech Stack
- Express.js
- Prisma
- Docker

## Getting Started

### 1. Configure Environment
> [!WARNING]
> You need to make a copy from `.env.example` file and rename it into `.env.local` for development and `.env.production` for production.

```bash
# Environment Setup
NODE_ENV=

# App Config
PORT=
JWT_SECRET=""

# Database Config
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
```
Notice that has environments value that you must filled in.
For `JWT_SECRET`, you can fill it anything, and it's needed for token.

> [!NOTE]
> It's highly recommended to generate from SSL Key for `JWT_SECRET`.

### 2. Run via Local

If you are in development, simply run this code : 
```bash
bun run dev
```
Or, if you want to debug, simply run this code : 
```bash
bun run debug
```

### 3. Run via docker

If you are in development, run docker file named `docker-compose.dev.yml`.

Or, if you in production stage, run docker file named `docker-compose.prod.yml`