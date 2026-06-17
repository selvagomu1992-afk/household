import { Router } from 'express';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone number are required' });
    }
    const exists = await User.findOne({ phone });
    if (exists) return res.status(409).json({ error: 'Phone number already registered' });

    const user = await User.create({ name, phone });
    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ error: 'Phone number not registered. Please register first.' });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
