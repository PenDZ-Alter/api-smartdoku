import type { NextFunction, Request, Response } from "express";
import { isSekretariat } from "../utils/check";

const allowedPartialFields = [
  "disp_3",
  "disp_4",
  "disp_3_notes",
  "disp_4_notes",
  "disp_lanjut",
  "tindak_lanjut_1",
  "tindak_lanjut_2",
  "tl_notes_1",
  "tl_notes_2",
  "status",
];

// dipakai untuk PUT (update)
export const limitUpdateFields = (req: Request, res: Response, next: NextFunction) => {
  const bidang = (req as any).user?.bidang;

  if (isSekretariat(bidang)) {
    return next(); // full access untuk sekretariat
  }

  // bukan sekretariat -> hanya boleh submit allowedPartialFields
  Object.keys(req.body).forEach((key) => {
    if (!allowedPartialFields.includes(key)) {
      delete req.body[key];
    }
  });

  return next();
};

// dipakai untuk DELETE (hanya sekretariat berdasarkan bidang)
export const onlySekretariatDelete = (req: Request, res: Response, next: NextFunction) => {
  const bidang = (req as any).user?.bidang;

  if (!isSekretariat(bidang)) {
    return res.status(403).json({ message: "Hanya Sekretariat (UKP / Renvapor) yang dapat menghapus surat!" });
  }

  return next();
};

// dipakai di POST untuk membolehkan USER hanya jika bidangnya sekretariat
export const allowCreateIfSekretariat = (req: Request, res: Response, next: NextFunction) => {
  const bidang = (req as any).user?.bidang;

  // ADMIN / SUPERADMIN boleh create langsung
  if (isSekretariat(bidang)) return next();

  // role USER hanya boleh create jika bidangnya sekretariat
//   if (role === "USER" && isSekretariat(bidang)) return next();

  return res.status(403).json({ message: "Kamu tidak punya izin membuat surat baru." });
};
