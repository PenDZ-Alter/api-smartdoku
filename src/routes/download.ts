import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { db } from '../utils/db.server';

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

export default router;