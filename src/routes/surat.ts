import express from 'express';
import * as SuratMasukService from '../services/suratMasuk';
import { requireRole } from '../middleware/requireRole';
import { CLI_ARGS } from '../services/args';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/masuk', authMiddleware, requireRole('USER', 'ADMIN', 'SUPERADMIN'), async (req, res) => {
  try {
    const surat = await SuratMasukService.listSuratMasuk();
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
    const surat = await SuratMasukService.getSuratMasuk(nomor_urut);
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
      dok_final,
      dok_dikirim,
      tanda_terima,
    } = req.body;

    const timestamp = new Date(Date.now());

    const data = await SuratMasukService.createSuratMasuk(
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
      dok_final,
      dok_dikirim,
      tanda_terima,
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
      dok_final,
      dok_dikirim,
      tanda_terima,
    } = req.body;

    const timestamp = new Date(Date.now());

    const data = await SuratMasukService.updateSuratMasuk(
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
      dok_final,
      dok_dikirim,
      tanda_terima,
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
    const data = await SuratMasukService.deleteSuratMasuk(nomor_urut);

    return res.status(200).json({ message: "Deleted Successfully!" });
  } catch (err) {
    console.log("[ERR] Error on surat masuk!")
    if (CLI_ARGS.debug) console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

export default router;