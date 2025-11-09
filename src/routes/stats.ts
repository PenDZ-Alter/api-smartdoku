import express from "express";
import { db, Disposisi } from "../utils/db.server";
import { authMiddleware } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { CLI_ARGS } from "../services/args";

const router = express.Router();

router.get("/surat/masuk", authMiddleware, requireRole('USER', 'ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    // 1️⃣ Hitung total surat
    const totalSuratMasuk = await db.dataSurat.count();

    // 2️⃣ Ambil semua disposisi dari DataSurat (JSON array)
    const semuaSuratMasuk = await db.dataSurat.findMany({
      select: { disposisi: true },
    });

    // 4️⃣ Siapkan counter disposisi (buat semua enum)
    const disposisiList = Object.values(Disposisi);
    const countMasuk: Record<string, number> = {};

    disposisiList.forEach((d) => {
      countMasuk[d] = 0;
    });

    // 5️⃣ Hitung total disposisi dari DataSurat (karena JSON array)
    for (const surat of semuaSuratMasuk) {
      try {
        const arr = Array.isArray(surat.disposisi)
          ? surat.disposisi
          : JSON.parse(surat.disposisi as unknown as string);

        arr.forEach((d: string) => {
          if (countMasuk[d] !== undefined) countMasuk[d]++;
        });
      } catch (err) {
        console.warn("[WARN] Gagal parse disposisi surat masuk:", surat);
      }
    }

    // 7️⃣ Kirim hasilnya
    res.json({
      success: true,
      data: {
        suratMasuk: {
          total: totalSuratMasuk,
          disposisiCount: countMasuk,
        }
      },
    });
  } catch (err) {
    if (CLI_ARGS.debug) console.error("[ERR->STATS]", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil statistik surat!",
    });
  }
});

router.get("/surat/keluar", authMiddleware, requireRole('USER', 'ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    // 1️⃣ Hitung total surat
    const totalSuratKeluar = await db.suratKeluar.count();

    // 3️⃣ Ambil semua pengolah (1 enum saja) dari SuratKeluar
    const semuaSuratKeluar = await db.suratKeluar.findMany({
      select: { pengolah: true },
    });

    // 4️⃣ Siapkan counter disposisi (buat semua enum)
    const disposisiList = Object.values(Disposisi);
    const countKeluar: Record<string, number> = {};

    disposisiList.forEach((d) => {
      countKeluar[d] = 0;
    });

    // 6️⃣ Hitung total disposisi dari SuratKeluar (enum tunggal)
    for (const surat of semuaSuratKeluar) {
      const d = surat.pengolah;
      if (d && countKeluar[d] !== undefined) countKeluar[d]++;
    }

    // 7️⃣ Kirim hasilnya
    res.json({
      success: true,
      data: {
        suratKeluar: {
          total: totalSuratKeluar,
          disposisiCount: countKeluar,
        }
      },
    });
  } catch (err) {
    if (CLI_ARGS.debug) console.error("[ERR->STATS]", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil statistik surat!",
    });
  }
});

router.get("/users", authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    const users = await db.user.findMany({
      select: { bidang: true },
    });

    const disposisiList = Object.values(Disposisi);
    const count: Record<string, number> = {};

    for (const d of disposisiList) count[d] = 0;

    for (const u of users) {
      count[u.bidang]++;
    }

    res.json({
      success: true,
      data: {
        totalUsers: users.length,
        perDisposisi: count,
      },
    });
  } catch (err) {
    if (CLI_ARGS.debug) console.error("[ERR->STATS]", err);
    res.status(500).json({ success: false, message: "Gagal ambil statistik user" });
  }
});

router.get('/disposisi', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    // Ambil semua nilai enum Disposisi
    const allDisposisi = Object.values(Disposisi);

    // Hitung totalnya
    const total = allDisposisi.length;

    res.json({
      success: true,
      total,
      data: allDisposisi,
    });
  } catch (err) {
    if (CLI_ARGS.debug) console.error('[ERR->STATS]', err);
    res.status(500).json({
      success: false,
      message: 'Gagal menghitung total disposisi',
    });
  }
});

export default router;
