import express from 'express';
import { upload } from '../middleware/uploadFile';
import { db } from '../utils/db.server';
import { ensureUploadFolder } from '../middleware/ensureUploadFolder';
import fs from 'fs';
import path from 'path';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';

const router = express.Router();

router.post('/surat/masuk', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), ensureUploadFolder, upload.single('file'), async (req, res) => {
  const { nomor_urut } = req.body;
  const nu_num = Number(nomor_urut);
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const existing = await db.dataSurat.findUnique({ 
      where: { nomor_urut: nu_num },
      select: { link_scan: true }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Data not found' });
    }

    if (existing.link_scan) {
      return res.status(400).json({ error: 'File already uploaded, cannot overwrite' });
    }

    const post = await db.dataSurat.update({
      where: { nomor_urut: nu_num },
      data: {
        link_scan: file.path,
      },
    });

    res.json({ message: 'File uploaded', data: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.post('/surat/keluar', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), ensureUploadFolder, upload.single('file'), async (req, res) => {
  const { nomor_urut } = req.body;
  const nu_num = Number(nomor_urut);
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const existing = await db.suratKeluar.findUnique({ 
      where: { nomor_urut: nu_num },
      select: { dok_final: true }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Data not found' });
    }

    if (existing.dok_final) {
      return res.status(400).json({ error: 'File already uploaded, cannot overwrite' });
    }

    const post = await db.suratKeluar.update({
      where: { nomor_urut: nu_num },
      data: {
        dok_final: file.path,
      },
    });

    res.json({ message: 'File uploaded', data: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.delete('/surat/masuk/:id', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  const id = Number(req.params.id);

  try {
    const surat = await db.dataSurat.findUnique({
      where: { nomor_urut: id },
    });

    if (!surat || !surat.link_scan) {
      return res.status(404).json({ error: 'File not found for this post' });
    }

    const filePath = path.join(__dirname, '../..', surat.link_scan);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await db.dataSurat.update({
      where: { nomor_urut: id },
      data: { link_scan: null },
    });

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file', detail: err });
  }
});

router.delete('/surat/keluar/:id', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  const id = Number(req.params.id);

  try {
    const surat = await db.suratKeluar.findUnique({
      where: { nomor_urut: id },
    });

    if (!surat || !surat.dok_final) {
      return res.status(404).json({ error: 'File not found for this post' });
    }

    const filePath = path.join(__dirname, '../..', surat.dok_final);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await db.suratKeluar.update({
      where: { nomor_urut: id },
      data: { dok_final: null },
    });

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file', detail: err });
  }
});

export default router;