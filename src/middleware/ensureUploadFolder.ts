import fs from 'fs';
import path from 'path';
import type { Request, Response, NextFunction } from 'express';

const folderPath = path.join(__dirname, '../..', 'uploads');

export const ensureUploadFolder = (req: Request, res: Response, next: NextFunction) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  next();
};
