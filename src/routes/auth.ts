import express  from 'express';
import type { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db.server';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

router.post('/register', async (req: Request, res: Response) => {
  const { name, username, email, password, address, phone_number, bidang } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await db.user.create({
      data: { 
        name: name, 
        username: username, 
        email: email, 
        password: hashed, 
        address: address, 
        phone_number: phone_number,
        bidang: bidang
      }
    });
    res.json({ 
      message: 'User Registered!', 
      user: { 
        id: user.id, 
        name: user.name, 
        username: user.username, 
        email: user.email, 
        address: user.address, 
        phone: user.phone_number
      } 
    });
  } catch (err) {
    res.status(400).json({ message: 'Email already exists' });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await db.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: "Invalid Credentials!" });

    const now = new Date();

    // Cek apakah user sedang "dikunci"
    if (user.failedAttempts >= 5 && user.lastAttempts) {
      const diffSeconds = (now.getTime() - user.lastAttempts.getTime()) / 1000;
      const cooldown = 5 * 60; // 5 menit
      if (diffSeconds < cooldown) {
        const remaining = Math.ceil(cooldown - diffSeconds);
        return res.status(429).json({
          message: `Terlalu banyak percobaan login. Coba lagi dalam ${remaining} detik.`,
        });
      }
    }

    // Cek password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      await db.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: { increment: 1 },
          lastAttempts: now,
        },
      });
      return res.status(401).json({ message: "Wrong Password!" });
    }

    // Login berhasil → reset counter
    await db.user.update({
      where: { id: user.id },
      data: {
        failedAttempts: 0,
        lastAttempts: null,
      },
    });

    // Buat token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, bidang: user.bidang },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bidang: user.bidang,
        role: user.role,
        address: user.address,
        phone_number: user.phone_number
      },
      token,
    });
  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;