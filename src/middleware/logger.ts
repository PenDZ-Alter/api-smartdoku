import type { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[MSG->REQ] ${req.method} ${req.url}`);
  console.log(`[MSG->IP] ${req.ip}`);
  next();
};
