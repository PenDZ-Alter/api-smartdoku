import { AsyncLocalStorage } from "node:async_hooks";

interface PrismaContext {
  id?: string;
  skipLogging?: boolean;
}

export const prismaContext = new AsyncLocalStorage<PrismaContext>();
