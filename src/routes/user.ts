import express from 'express';
import * as UserService from '../services/user';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';

const router = express.Router();

router.get('/user', authMiddleware, requireRole('SUPERADMIN'), async (req, res) => {
    const users = await UserService.listUsers();

    if (!users) return res.status(401).json({ message: "No user are registered!" });

    return res.status(200).json(users);
});

router.get('/user/:id', authMiddleware, requireRole('SUPERADMIN'), async (req, res) => {
    const id = req.params.id;
    const user = await UserService.getUser(id);

    if (!user) return res.status(401).json({ message: "User not found!" });

    return res.status(200).json(user);
});

export default router;