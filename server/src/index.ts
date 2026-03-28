import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import metricsRoutes from './routes/metrics';
import statusRoutes from './routes/status';
import { startMonitorJob } from './jobs/monitorJob';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/status', statusRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
const start = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/siteguard';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      startMonitorJob();
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

start();

export default app;
