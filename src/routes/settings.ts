import express  from 'express';
import * as GlobalSettings from '../services/settings';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';

const router = express.Router();

router.get('/', authMiddleware, requireRole('USER', 'ADMIN', 'SUPERADIN'), async (req, res) => {
  const data = await GlobalSettings.listSettings();

  if (!data) return res.status(400).json({ message: "Can't find global settings!" });

  return res.status(200).json({ message: "Successfully getting global settings!", data });
});

router.get('/:id', authMiddleware, requireRole('USER', 'ADMIN', 'SUPERADIN'), async (req, res) => {
  const id = Number(req.params.id);
  const data = await GlobalSettings.getSetting(id);

  if (!data) return res.status(400).json({ message: "Can't find current global settings!" });

  return res.status(200).json({ message: "Successfully getting current global settings!", data });
});

router.post('/', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  const { suffix_code } = req.body;

  try {
    const data = await GlobalSettings.addSetting(suffix_code);

    return res.status(200).json({ message: "Successfully adding setting!", data });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Something went wrong in the server! Please contact support service!" });
  }
});

router.put('/:id', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const { suffix_code } = req.body;

  try {
    const data = await GlobalSettings.updateSetting(id, suffix_code);

    return res.status(200).json({ message: "Successfully update setting!", data });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Something went wrong in the server! Please contact support service!" })
  }
});

router.delete('/:id', authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req, res) => {
  const id = Number(req.params.id);

  try {
    const data = await GlobalSettings.deleteSetting(id);

    return res.status(200).json({ message: "Successfully delete setting!", data });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Something went wrong in the server! Please contact support service!" })
  }
});

export default router;