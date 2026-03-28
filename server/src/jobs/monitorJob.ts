import cron from 'node-cron';
import axios from 'axios';
import Client from '../models/Client';
import UptimeLog from '../models/UptimeLog';
import Alert from '../models/Alert';
import User from '../models/User';
import { sendAlert } from '../utils/mailer';
import { sendSlackAlert } from '../utils/slack';
import { checkSSL } from '../utils/sslChecker';

const SLOW_THRESHOLD_MS = 3000;

export const startMonitorJob = () => {
  // Run every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    try {
      const clients = await Client.find({});
      await Promise.allSettled(
        clients.map(async (client) => {
          const start = Date.now();
          let status: 'up' | 'down' | 'warn' = 'up';
          let responseMs = 0;
          let statusCode = 200;

          try {
            const response = await axios.get(client.url, { timeout: 10000 });
            responseMs = Date.now() - start;
            statusCode = response.status;
            status = responseMs > SLOW_THRESHOLD_MS ? 'warn' : 'up';
          } catch {
            responseMs = Date.now() - start;
            status = 'down';
            statusCode = 0;
          }

          // Save uptime log
          await UptimeLog.create({
            clientId: client._id,
            status,
            responseMs,
            statusCode,
            checkedAt: new Date(),
          });

          // Calculate 90-day uptime
          const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);
          const logs = await UptimeLog.find({
            clientId: client._id,
            checkedAt: { $gte: ninetyDaysAgo },
          });
          const upCount = logs.filter((l) => l.status !== 'down').length;
          const uptime90d = logs.length ? (upCount / logs.length) * 100 : 100;
          const avgResponseMs = logs.length
            ? logs.reduce((a, l) => a + l.responseMs, 0) / logs.length
            : responseMs;

          // Check SSL
          const sslResult = await checkSSL(client.url);
          const sslExpiresInDays = sslResult.daysRemaining;

          // Update client
          await Client.findByIdAndUpdate(client._id, {
            status,
            avgResponseMs: Math.round(avgResponseMs),
            uptime90d: Math.round(uptime90d * 100) / 100,
            sslExpiresInDays,
            lastChecked: new Date(),
          });

          // Fire alerts if down or slow
          if (status === 'down' || status === 'warn') {
            const existingAlert = await Alert.findOne({
              clientId: client._id,
              type: status === 'down' ? 'down' : 'slow',
              resolved: false,
            });
            if (!existingAlert) {
              const alertMsg = status === 'down'
                ? `🔴 ${client.name} (${client.url}) is DOWN`
                : `⚠️ ${client.name} (${client.url}) is slow (${responseMs}ms)`;

              await Alert.create({
                clientId: client._id,
                userId: client.userId,
                type: status === 'down' ? 'down' : 'slow',
                message: alertMsg,
                resolved: false,
              });

              // Notify user
              const user = await User.findById(client.userId);
              if (user) {
                if (user.alertChannels.email) {
                  await sendAlert(user.email, `SiteGuard Alert: ${client.name}`, alertMsg);
                }
                if (user.alertChannels.slack && user.alertChannels.slackWebhookUrl) {
                  await sendSlackAlert(user.alertChannels.slackWebhookUrl, alertMsg);
                }
              }
            }
          } else {
            // Resolve any existing alerts
            await Alert.updateMany(
              { clientId: client._id, resolved: false },
              { resolved: true }
            );
          }

          // SSL expiry alert
          if (sslExpiresInDays < 30) {
            const sslAlert = await Alert.findOne({
              clientId: client._id,
              type: 'ssl',
              resolved: false,
            });
            if (!sslAlert) {
              await Alert.create({
                clientId: client._id,
                userId: client.userId,
                type: 'ssl',
                message: `🔐 SSL certificate for ${client.name} expires in ${sslExpiresInDays} days`,
                resolved: false,
              });
            }
          }
        })
      );
    } catch (err) {
      console.error('Monitor job error:', err);
    }
  });

  console.log('✅ Monitor job started (every 30s)');
};
