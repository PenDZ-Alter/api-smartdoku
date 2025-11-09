import type { Request, Response, NextFunction } from 'express';
import { CLI_ARGS } from '../services/args';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[MSG->REQ] ${req.method} ${req.url}`);
  console.log(`[MSG->IP] ${req.ip}`);
  if (CLI_ARGS.verbose) console.log(`[MSG->BODY] : \n${JSON.stringify(req.body, null, 2)}`);
  next();
};
