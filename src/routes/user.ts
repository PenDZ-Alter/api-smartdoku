import express from 'express';
import * as UserService from '../services/user';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/', authMiddleware, requireRole('SUPERADMIN'), async (req, res) => {
  const users = await UserService.listUsers();

  if (!users) return res.status(401).json({ message: "No user are registered!" });

  return res.status(200).json(users);
});

router.post('/', authMiddleware, requireRole('SUPERADMIN'), async (req, res) => {
  const { name, username, email, password, bidang, role, address, phone_number } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const users = await UserService.addUser(email, name, username, bidang, role, address, phone_number, hashed);

  if (!users) return res.status(401).json({ message: "No user are registered!" });

  return res.status(200).json(users);
});

router.get('/:id', authMiddleware, requireRole('SUPERADMIN'), async (req, res) => {
  const id = req.params.id;
  const user = await UserService.getUser(id);

  if (!user) return res.status(401).json({ message: "User not found!" });

  return res.status(200).json(user);
});

router.put('/:id', authMiddleware, requireRole('SUPERADMIN'), async (req, res) => {
  const id = req.params.id;
  const { name, username, email, role, address, phone_number, bidang } = req.body;

  const user = await UserService.updateUser(id, email, name, username, bidang, role, address, phone_number);

  if (!user) return res.status(401).json({ message: "User not found!" });

  return res.status(200).json({ message: "Successfully updated user!" });
});

router.delete('/:id', authMiddleware, requireRole('SUPERADMIN'), async (req, res) => {
  const id = req.params.id;
  const user = await UserService.deleteUser(id);

  if (!user) return res.status(401).json({ message: "User not found!" });

  return res.status(200).json({ message: "Successfully deleted user!" });
});

router.put('/pass/:id', authMiddleware, requireRole('SUPERADMIN'), async (req, res) => {
  const id = req.params.id;
  const { password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const user = await UserService.changePassword(id, hashed);

  return res.status(200).json({ message: "Successfully changed password", data: { name: user.name, email: user.email } });
});

export default router;