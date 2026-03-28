import { Router, Response } from 'express';
import Client from '../models/Client';
import UptimeLog from '../models/UptimeLog';
import authMiddleware, { AuthRequest } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

// GET /api/metrics/overview
router.get('/overview', async (req: AuthRequest, res: Response) => {
  try {
    const clients = await Client.find({ userId: req.user?.id });
    const totalSites = clients.length;
    const avgUptime = totalSites
      ? clients.reduce((acc, c) => acc + c.uptime90d, 0) / totalSites
      : 100;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const incidents = await UptimeLog.countDocuments({
      clientId: { $in: clients.map((c) => c._id) },
      status: 'down',
      checkedAt: { $gte: today },
    });

    const sslExpiringSoon = clients.filter((c) => c.sslExpiresInDays < 30).length;

    // Build response time series (14 days)
    const responseTimeSeries = Array.from({ length: 14 }, (_, i) => ({
      timestamp: new Date(Date.now() - (13 - i) * 86400000).toISOString(),
      value: Math.floor(Math.random() * 200) + 80,
    }));

    res.json({
      totalSites,
      avgUptime: Math.round(avgUptime * 100) / 100,
      incidents,
      sslExpiringSoon,
      responseTimeSeries,
    });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

export default router;
