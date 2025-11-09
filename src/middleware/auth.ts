import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prismaContext } from '../utils/context';

// Tipe payload token JWT
export interface JwtPayload {
  id: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

// Extend Request supaya ada user
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded?.id) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Simpan user ke request
    req.user = decoded;

    // Jalankan prisma context untuk seluruh request berikutnya
    prismaContext.run({ id: decoded.id }, () => {
      next();
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
