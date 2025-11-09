import { prismaContext } from "../utils/context";
import type { AuthRequest } from "./auth";
import type { Response, NextFunction } from "express";

export const contextMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.user?.id;
  prismaContext.run({ id }, () => next());
};
