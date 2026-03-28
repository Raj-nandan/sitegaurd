import { Router, Request, Response } from 'express';
import Client from '../models/Client';
import User from '../models/User';

const router = Router();

// GET /api/status/:userId — public, no auth required
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).select('name email');
    if (!user) { res.status(404).json({ message: 'Not found' }); return; }
    const clients = await Client.find({ userId: req.params.userId });
    res.json({
      user: { name: user.name },
      sites: clients.map((c) => ({
        _id: c._id,
        name: c.name,
        url: c.url,
        status: c.status,
        uptime90d: c.uptime90d,
        lastChecked: c.lastChecked,
      })),
    });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

export default router;
