import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authMiddleware, { AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: 'All fields required' });
      return;
    }
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }
    const user = await User.create({ name, email, passwordHash: password });
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    res.status(201).json({
      user: { _id: user._id, name: user.name, email: user.email, plan: user.plan, onboardingCompleted: user.onboardingCompleted },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    res.json({
      user: { _id: user._id, name: user.name, email: user.email, plan: user.plan, onboardingCompleted: user.onboardingCompleted, alertChannels: user.alertChannels },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-passwordHash');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/auth/onboarding
router.patch('/onboarding', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { role, alertChannels, slackWebhookUrl } = req.body;
    const update: Record<string, unknown> = { onboardingCompleted: true };
    if (alertChannels) {
      update.alertChannels = {
        email: alertChannels.includes('email') || alertChannels.includes('both'),
        slack: alertChannels.includes('slack') || alertChannels.includes('both'),
        slackWebhookUrl,
      };
    }
    const user = await User.findByIdAndUpdate(req.user?.id, update, { new: true }).select('-passwordHash');
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
