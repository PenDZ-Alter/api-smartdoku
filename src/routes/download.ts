import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { db } from '../utils/db.server';
import ExcelJS from 'exceljs';
import * as SuratService from '../services/surat';

const router = express.Router();

router.get('/surat/masuk/:num', authMiddleware, requireRole('USER', 'ADMIN', 'SUPERADMIN'), async (req, res) => {
  const nu_num = Number(req.params.num);
  
  const file = await db.dataSurat.findUnique({
    where: { nomor_urut: nu_num },
    select: { link_scan: true }
  });

  if (!file?.link_scan) return res.status(402).json({ message: "Can't find the file!" });

  const filePath = '../../';

  res.download(filePath, file.link_scan, (err) => {
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

  const filePath = '../../';

  res.download(filePath, file.dok_final, (err) => {
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
  await workbook.xlsx.readFile("docs/template_disposisi.xlsx");

  const worksheet = workbook.getWorksheet('disposisi');

  if (!worksheet) return res.status(500).json({ message: "Unaccessable data!" });

  worksheet.getCell("C10").value = data?.nama_surat ?? "-";
  worksheet.getCell("G10").value = data?.tanggal_diterima ?? "-";
  worksheet.getCell("C12").value = data?.tanggal_surat ?? "-";
  worksheet.getCell("G11").value = data?.no_agenda ?? "-";
  worksheet.getCell("C11").value = data?.no_surat ?? "-";
  worksheet.getCell("C14").value = data?.hal ?? "-";
  worksheet.getCell("C15").value = data?.tanggal_waktu ?? "-";
  worksheet.getCell("C16").value = data?.tanggal_waktu ?? "-";
  worksheet.getCell("C17").value = data?.tempat ?? "-";

  // kirim hasil ke client (download)
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=disposisi_${nomor_urut}.xlsx`
  );
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

  await workbook.xlsx.write(res);
  res.end();
});

export default router;