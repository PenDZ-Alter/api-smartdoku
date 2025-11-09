import { PrismaClient, Role, Disposisi, Status } from "@prisma/client";
import { prismaContext } from "./context";
import { CLI_ARGS } from "../services/args";

// 🔹 Base instance Prisma
const base = new PrismaClient();

// 🔹 Prisma instance dengan logging extension
const prisma = base.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const result = await query(args);

        // 🔹 Ambil userId dari context (di-set di middleware JWT)
        const context = prismaContext.getStore();
        const userId = context?.id ?? null;

        // 🔹 Daftar model yang dilog
        const loggedModels = ["DataSurat", "SuratKeluar"];
        const writeOps = ["create", "update", "delete"];

        if (!userId || !loggedModels.includes(model) || !writeOps.includes(operation)) {
          return result; // skip log kalau ga perlu
        }

        try {
          // 🔹 Ambil nama user (dari base, bukan db!)
          const user = await base.user.findUnique({
            where: { id: userId },
            select: { name: true },
          });

          const userName = user?.name ?? "Unknown";
          const action = operation.toUpperCase();

          // 🔹 Tentukan jenis surat
          const jenis = model === "DataSurat" ? "surat masuk" : "surat keluar";
          const targetId =
            (result as any)?.id ??
            (typeof args === "object" && "where" in args ? (args as any)?.where?.id : undefined) ??
            "-";

          // 🔹 Buat deskripsi log
          const details =
            action === "CREATE"
              ? `User ${userName} menambah ${jenis} dengan ID ${targetId}`
              : action === "UPDATE"
              ? `User ${userName} mengubah ${jenis} dengan ID ${targetId}`
              : `User ${userName} menghapus ${jenis} dengan ID ${targetId}`;

          // 🔹 Simpan log ke database
          await base.log.create({
            data: {
              userId, // wajib, karena non-nullable
              action,
              model,
              modelId: targetId,
              details,
            },
          });

          // 🔹 Batasi maksimal 5000 log (hapus yang lama)
          const count = await base.log.count();
          if (count > 5000) {
            const oldest = await base.log.findFirst({
              orderBy: { timestamp: "asc" },
              select: { id: true },
            });
            if (oldest) {
              await base.log.delete({ where: { id: oldest.id } });
            }
          }

          if (CLI_ARGS.debug) console.log(`[LOG] ${userName} doing ${action} in ${model}`);
        } catch (err) {
          console.error("[ERR->LOG]", err);
        }

        return result;
      },
    },
  },
});

// 🔹 Singleton pattern
let db: typeof prisma;

declare global {
  var __db: typeof prisma | undefined;
}

if (!global.__db) {
  global.__db = prisma;
}

db = global.__db;

export { db, Role, Disposisi, Status };
