import { AsyncLocalStorage } from "node:async_hooks";

interface PrismaContext {
  id?: string;
}

export const prismaContext = new AsyncLocalStorage<PrismaContext>();
