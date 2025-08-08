import express from 'express';
import * as SuratService from '../services/surat';
import { requireRole } from '../middleware/requireRole';
import { CLI_ARGS } from '../services/args';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/* Surat Masuk */
router.get('/masuk', authMiddleware, requireRole('USER', 'ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    const surat = await SuratService.listSuratMasuk();
    return res.status(200).json(surat);
  } catch (err) {
    console.log("[ERR] Error on surat masuk!")
    if (CLI_ARGS.debug) console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.get('/masuk/:num', authMiddleware, requireRole('USER', 'ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    const nomor_urut = Number(req.params.num);
    const surat = await SuratService.getSuratMasuk(nomor_urut);
    return res.status(200).json(surat);
  } catch (err) {
    console.log("[ERR] Error on surat masuk!")
    if (CLI_ARGS.debug) console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.post('/masuk', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    const {
      nama_surat,
      tanggal_diterima,
      tanggal_surat,
      kode,
      no_agenda,
      no_surat,
      hal,
      tanggal_waktu,
      tempat,
      disposisi,
      index,
      pengolah,
      sifat,
      link_scan,
      disp_1,
      disp_2,
      disp_3,
      disp_4 ,
      disp_1_notes,
      disp_2_notes,
      disp_3_notes,
      disp_4_notes,
      disp_lanjut,
      tindak_lanjut_1,
      tindak_lanjut_2,
      tl_notes_1,
      tl_notes_2,
      status,
    } = req.body;

    const timestamp = new Date(Date.now());

    const data = await SuratService.createSuratMasuk(
      nama_surat,
      tanggal_diterima,
      tanggal_surat,
      kode,
      no_agenda,
      no_surat,
      hal,
      tanggal_waktu,
      tempat,
      disposisi,
      index,
      pengolah,
      sifat,
      link_scan,
      disp_1,
      disp_2,
      disp_3,
      disp_4 ,
      disp_1_notes,
      disp_2_notes,
      disp_3_notes,
      disp_4_notes,
      disp_lanjut,
      tindak_lanjut_1,
      tindak_lanjut_2,
      tl_notes_1,
      tl_notes_2,
      status,
      timestamp);

    return res.status(200).json(data);
  } catch (err) {
    console.log("[ERR] Error on surat masuk!")
    if (CLI_ARGS.debug) console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.put('/masuk/:num', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    const nomor_urut = Number(req.params.num);
    const { 
      nama_surat,
      tanggal_diterima,
      tanggal_surat,
      kode,
      no_agenda,
      no_surat,
      hal,
      tanggal_waktu,
      tempat,
      disposisi,
      index,
      pengolah,
      sifat,
      link_scan,
      disp_1,
      disp_2,
      disp_3,
      disp_4 ,
      disp_1_notes,
      disp_2_notes,
      disp_3_notes,
      disp_4_notes,
      disp_lanjut,
      tindak_lanjut_1,
      tindak_lanjut_2,
      tl_notes_1,
      tl_notes_2,
      status,
    } = req.body;

    const timestamp = new Date(Date.now());

    const data = await SuratService.updateSuratMasuk(
      nomor_urut,
      nama_surat,
      tanggal_diterima,
      tanggal_surat,
      kode,
      no_agenda,
      no_surat,
      hal,
      tanggal_waktu,
      tempat,
      disposisi,
      index,
      pengolah,
      sifat,
      link_scan,
      disp_1,
      disp_2,
      disp_3,
      disp_4 ,
      disp_1_notes,
      disp_2_notes,
      disp_3_notes,
      disp_4_notes,
      disp_lanjut,
      tindak_lanjut_1,
      tindak_lanjut_2,
      tl_notes_1,
      tl_notes_2,
      status,
      timestamp
    );

    return res.status(200).json(data);
  } catch (err) {
    console.log("[ERR] Error on surat masuk!")
    if (CLI_ARGS.debug) console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.delete('/masuk/:num', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    const nomor_urut = Number(req.params.num);
    const data = await SuratService.deleteSuratMasuk(nomor_urut);

    return res.status(200).json({ message: "Surat Masuk Deleted Successfully!", data: { id: data?.id, nomor_urut: data?.nomor_urut } });
  } catch (err) {
    console.log("[ERR] Error on surat masuk!")
    if (CLI_ARGS.debug) console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

/* Surat Keluar */
router.get('/keluar', authMiddleware, requireRole('USER', 'ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    const data = await SuratService.listSuratKeluar();

    return res.status(200).json(data);
  } catch (err) {
    console.log("[ERR] Error on surat keluar!")
    if (CLI_ARGS.debug) console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.get('/keluar/:num', authMiddleware, requireRole('USER', 'ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    const nomor_urut = Number(req.params.num);
    const data = await SuratService.getSuratKeluar(nomor_urut);

    return res.status(200).json(data);
  } catch (err) {
    console.log("[ERR] Error on surat keluar!")
    if (CLI_ARGS.debug) console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.post('/keluar', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    const {
      kode,
      klasifikasi,
      no_register,
      tujuan_surat,
      perihal,
      tanggal_surat,
      akses_arsip,
      pengolah,
      pembuat,
      catatan,
      link_surat,
      koreksi_1,
      koreksi_2,
      status,
      dok_final,
      dok_dikirim,
      tanda_terima
    } = req.body;

    const timestamp = new Date(Date.now());
    const data = await SuratService.createSuratKeluar(
      kode,
      klasifikasi,
      no_register,
      tujuan_surat,
      perihal,
      tanggal_surat,
      akses_arsip,
      pengolah,
      pembuat,
      catatan,
      link_surat,
      koreksi_1,
      koreksi_2,
      status,
      dok_final,
      dok_dikirim,
      tanda_terima,
      timestamp
    );

    return res.status(200).json(data);
  } catch (err) {
    console.log("[ERR] Error on surat keluar!")
    if (CLI_ARGS.debug) console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.put('/keluar/:num', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    const nomor_urut = Number(req.params.id);
    const {
      kode,
      klasifikasi,
      no_register,
      tujuan_surat,
      perihal,
      tanggal_surat,
      akses_arsip,
      pengolah,
      pembuat,
      catatan,
      link_surat,
      koreksi_1,
      koreksi_2,
      status,
      dok_final,
      dok_dikirim,
      tanda_terima
    } = req.body;

    const timestamp = new Date(Date.now());
    const data = await SuratService.updateSuratKeluar(
      nomor_urut,
      kode,
      klasifikasi,
      no_register,
      tujuan_surat,
      perihal,
      tanggal_surat,
      akses_arsip,
      pengolah,
      pembuat,
      catatan,
      link_surat,
      koreksi_1,
      koreksi_2,
      status,
      dok_final,
      dok_dikirim,
      tanda_terima,
      timestamp
    );

    return res.status(200).json(data);
  } catch (err) {
    console.log("[ERR] Error on surat keluar!")
    if (CLI_ARGS.debug) console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.delete('/keluar/:num', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    const nomor_urut = Number(req.params.num);
    const data = await SuratService.deleteSuratKeluar(nomor_urut);

    return res.status(200).json({ message: "Surat Keluar deleted Successfully!", data: { id: data?.id, nomor_urut: data?.nomor_urut } });
  } catch (err) {
    console.log("[ERR] Error on surat keluar!")
    if (CLI_ARGS.debug) console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

export default router;