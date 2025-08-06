import { PrismaClient, Role, Disposisi, Status, AksesArsip, DispLanjutan } from "@prisma/client"

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

db = global.__db;

export { db, Role, Disposisi, Status, AksesArsip, DispLanjutan };