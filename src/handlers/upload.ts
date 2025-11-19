import multer from 'multer';
import { upload } from '../middleware/files';
import type { NextFunction, Request, Response } from 'express';

export const uploadSetup = (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};