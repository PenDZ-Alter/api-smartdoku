import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { db } from '../utils/db.server';
import ExcelJS from 'exceljs';
import * as SuratService from '../services/surat';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { exec } from "child_process";
import { CLI_ARGS } from '../services/args';

const router = express.Router();

const execAsync = promisify(exec);

router.get('/surat/masuk/:num', authMiddleware, requireRole('USER', 'ADMIN', 'SUPERADMIN'), async (req, res) => {
  const nu_num = Number(req.params.num);
  
  const file = await db.dataSurat.findUnique({
    where: { nomor_urut: nu_num },
    select: { link_scan: true }
  });

  if (!file?.link_scan) return res.status(402).json({ message: "Can't find the file!" });

  const filePath = path.join(__dirname, '..', '..') + "/" + file.link_scan;

  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error downloading file!" });
    }
  });
});

router.get('/surat/keluar/:num', authMiddleware, requireRole('USER', 'ADMIN', 'SUPERADMIN'), async (req, res) => {
  const nu_num = Number(req.params.num);
  
  const file = await db.suratKeluar.findUnique({
    where: { nomor_urut: nu_num },
    select: { dok_final: true }
  });

  if (!file?.dok_final) return res.status(402).json({ message: "Can't find the file!" });

  const filePath = path.join(__dirname, '..', '..') + "/" + file.dok_final;

  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error downloading file!" });
    }
  });
});

router.get('/disposisi/:num', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  const nomor_urut = Number(req.params.num);

  const data = await SuratService.getSuratMasuk(nomor_urut);

  if (!data) return res.status(400).json({ message: "Data not found!" });

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("docs/template_disposisi_v2.xlsx");

  const worksheet = workbook.getWorksheet('disposisi');

  if (!worksheet) return res.status(500).json({ message: "Unaccessable data!" });

  // === Simpan sementara file XLSX ===
  const tmpDir = path.join(__dirname, "../temp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  console.log(`[DEBUG] -> [STATE] : Temp Dir Path : ${tmpDir}`);

  const xlsxPath = path.join(tmpDir, `disposisi_${nomor_urut}.xlsx`);
  const pdfPath = path.join(tmpDir, `disposisi_${nomor_urut}.pdf`);

  
  worksheet.getCell("C10").value = data?.nama_surat ?? "-";
  worksheet.getCell("G10").value = data?.tanggal_diterima ?? "-";
  worksheet.getCell("C12").value = data?.tanggal_surat ?? "-";
  worksheet.getCell("G11").value = data?.no_agenda ?? "-";
  worksheet.getCell("C11").value = data?.no_surat ?? "-";
  worksheet.getCell("C14").value = data?.hal ?? "-";
  worksheet.getCell("C15").value = data?.tanggal_waktu ?? "-";
  worksheet.getCell("C16").value = data?.tanggal_waktu ?? "-";
  worksheet.getCell("C17").value = data?.tempat ?? "-";
  
  await workbook.xlsx.writeFile(xlsxPath);

  // === Convert XLSX ke PDF pakai LibreOffice (headless mode) ===
  const cmd = `libreoffice --headless --convert-to pdf "${xlsxPath}" --outdir "${tmpDir}"`;
  await execAsync(cmd);

  // === Tunggu sampai file PDF benar-benar muncul ===
  let maxWait = 20; // maksimal 2 detik (20 x 100ms)
  while (!fs.existsSync(pdfPath) && maxWait > 0) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    maxWait--;
  }

  if (!fs.existsSync(pdfPath)) {
    console.error("[ERR] Failed when converting by LibreOffice");
    return res.status(500).json({ message: "Gagal membuat file PDF" });
  }

  // === Kirim hasil ke client (download) ===
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=disposisi_${nomor_urut}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");

  const pdfStream = fs.createReadStream(pdfPath);
  
  pdfStream.on("close", () => {
    fs.unlink(xlsxPath, () => {});
    fs.unlink(pdfPath, () => {});
  });
  
  pdfStream.on("error", (err) => {
    if (CLI_ARGS.debug) console.error("Stream error:", err);
    return res.status(500).json("Failed to send PDF");
  });

  pdfStream.pipe(res);
});

export default router;