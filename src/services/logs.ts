import { db } from '../utils/db.server';
import type { Log } from "@prisma/client";

export async function getLogs(userId: string, limit: number = 100) : Promise<Log[]> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const where =
    user.role === "SUPERADMIN"
      ? {}
      : { userId };

  // 🔹 Ambil log-nya
  return db.log.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
      dataSurat: {
        select: {
          id: true,
          nama_surat: true,
          tanggal_surat: true,
        },
      },
      suratKeluar: {
        select: {
          id: true,
          kode: true,
          perihal: true,
          tanggal_surat: true,
        },
      },
    },
    orderBy: { timestamp: "desc" },
    take: limit,
  });
}