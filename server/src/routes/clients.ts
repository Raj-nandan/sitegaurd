import { Router, Response } from 'express';
import axios from 'axios';
import Client from '../models/Client';
import UptimeLog from '../models/UptimeLog';
import Alert from '../models/Alert';
import authMiddleware, { AuthRequest } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

// Helper: generate mock metrics
const mockResponseSeries = () =>
  Array.from({ length: 14 }, (_, i) => ({
    timestamp: new Date(Date.now() - (13 - i) * 86400000).toISOString(),
    value: Math.floor(Math.random() * 300) + 80,
  }));

const mockUptimeHistory = () =>
  Array.from({ length: 90 }, () => Math.random() > 0.04);

// GET /api/clients
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const clients = await Client.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json(clients);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// POST /api/clients
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, url, contactEmail, checkInterval, alertChannels } = req.body;
    // Quick ping to get initial response time
    let avgResponseMs = 0;
    try {
      const start = Date.now();
      await axios.get(url, { timeout: 5000 });
      avgResponseMs = Date.now() - start;
    } catch { /* ignore */ }

    const client = await Client.create({
      userId: req.user?.id,
      name,
      url,
      contactEmail,
      checkInterval: checkInterval || 60,
      alertChannels: alertChannels || ['email'],
      avgResponseMs,
      status: 'up',
      uptime90d: 100,
      sslExpiresInDays: 90,
      domainExpiresInDays: 365,
      lastChecked: new Date(),
    });
    res.status(201).json(client);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/clients/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!client) { res.status(404).json({ message: 'Client not found' }); return; }
    res.json(client);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// DELETE /api/clients/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await Client.deleteOne({ _id: req.params.id, userId: req.user?.id });
    await UptimeLog.deleteMany({ clientId: req.params.id });
    await Alert.deleteMany({ clientId: req.params.id });
    res.json({ message: 'Client deleted' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/clients/:id/metrics
router.get('/:id/metrics', async (req: AuthRequest, res: Response) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!client) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({
      responseTimeSeries: mockResponseSeries(),
      uptimeHistory: mockUptimeHistory(),
      endpointStats: [
        { endpoint: '/', avgMs: Math.floor(Math.random() * 200) + 60 },
        { endpoint: '/api/users', avgMs: Math.floor(Math.random() * 400) + 100 },
        { endpoint: '/api/data', avgMs: Math.floor(Math.random() * 500) + 150 },
        { endpoint: '/checkout', avgMs: Math.floor(Math.random() * 600) + 200 },
        { endpoint: '/blog', avgMs: Math.floor(Math.random() * 300) + 80 },
      ],
    });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/clients/:id/logs
router.get('/:id/logs', async (req: AuthRequest, res: Response) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!client) { res.status(404).json({ message: 'Not found' }); return; }
    const paths = ['/', '/api/users', '/api/data', '/blog', '/checkout', '/about'];
    const codes = [200, 200, 200, 200, 301, 404, 500];
    const logs = Array.from({ length: 50 }, (_, i) => ({
      id: `log-${i}`,
      statusCode: codes[Math.floor(Math.random() * codes.length)],
      method: 'GET',
      path: paths[Math.floor(Math.random() * paths.length)],
      responseMs: Math.floor(Math.random() * 800) + 50,
      timestamp: new Date(Date.now() - i * 180000).toISOString(),
    }));
    res.json(logs);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/clients/:id/vitals
router.get('/:id/vitals', async (req: AuthRequest, res: Response) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!client) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({
      LCP: 2.4,
      FID: 18,
      CLS: 0.08,
      TTFB: 320,
      FCP: 1.8,
      INP: 180,
      lighthouseScore: 84,
    });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/clients/:id/ssl
router.get('/:id/ssl', async (req: AuthRequest, res: Response) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!client) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({
      ssl: {
        issuer: 'Let\'s Encrypt',
        expiresInDays: client.sslExpiresInDays,
        protocol: 'TLS 1.3',
        grade: 'A+',
      },
      domain: {
        registrar: 'GoDaddy',
        expiresInDays: client.domainExpiresInDays,
        nameservers: ['ns1.example.com', 'ns2.example.com'],
        dnssec: true,
      },
    });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

export default router;
