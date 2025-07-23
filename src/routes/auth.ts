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
    res.json({ message: 'User Registered!', user: { id: user.id, name: user.name, username: user.username, email: user.email, address: user.address, phone: user.phone_number?.toString() } });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid Credentials!" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Wrong Password!" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30m' });
  res.json({ name: user.name, username: user.username, email: user.email, bidang: user.bidang, role: user.role, token: token });
});

export default router;