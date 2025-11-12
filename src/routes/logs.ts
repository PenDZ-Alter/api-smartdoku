import express from "express";
import { authMiddleware } from "../middleware/auth";
import * as LogService from "../services/logs";
import { requireRole } from "../middleware/requireRole";

const router = express.Router();

router.get("/", authMiddleware, requireRole('ADMIN', 'SUPERADMIN'), async (req: any, res) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit as string) || 100;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const logs = await LogService.getLogs(userId, limit);

    res.json({
      success: true,
      total: logs.length,
      data: logs,
    });
  } catch (err) {
    console.error("[ERR->LOG]", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data log",
    });
  }
});

export default router;
