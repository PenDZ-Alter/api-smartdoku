# api-smartdoku
An API Endpoint for DPKPCK to manage apps for SmartDoku.

## Tech Stack
- Express.js
- Prisma

## Getting Started

### 1. Configure Environment
> [!WARNING]
> You need to make a copy from `.env.example` file and rename it into `.env.local` for development and `.env.production` for production.

```bash
PORT=
JWT_SECRET=
```
Notice that has 2 environments value that you must filled in.
For `JWT_SECRET`, you can fill it anything, and it's needed for token.

> [!NOTE]
> It's really recommended to generate from SSL Key for `JWT_SECRET`.

### 2. Configure Environment (For Prisma)
> [!WARNING]
> You need to make a copy from `.env.example` file and rename it into `.env`.

Prisma is using `dotenv-expand` for his environment. So, that's why the environment is different.

```bash
DATABASE_URL=
```
You can fill `DATABASE_URL` based on provider you used.

For example, if you are using MySQL, the environment value is look like this : 

```bash
DATABASE_URL="mysql://<user>:<password>@<url/ip>:<port>/api-pensudis"
```

Refer to this ![documentation](https://www.prisma.io/docs) for more further information.