import express from 'express';
import * as SuratMasukService from '../services/suratMasuk';

const router = express.Router();

router.get('/masuk', async (req, res) => {
  try {
    const surat = await SuratMasukService.listSuratMasuk();
    return res.status(200).json(surat);
  } catch (err) {
    console.log("[ERR] Error on surat masuk!")
    console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.get('/masuk/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const surat = await SuratMasukService.getSuratMasuk(id);
    return res.status(200).json(surat);
  } catch (err) {
    console.log("[ERR] Error on surat masuk!")
    console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});

router.post('/masuk/create', async (req, res) => {
  try {
    const {  
      
    } = req.body;
  } catch (err) {
    console.log("[ERR] Error on surat masuk!")
    console.error(err);
    return res.status(400).json({ message: "Something went wrong!" });
  }
});