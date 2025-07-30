import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERR] ` + err.stack);
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
};
