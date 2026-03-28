import axios from 'axios';

export const sendSlackAlert = async (webhookUrl: string, message: string): Promise<void> => {
  try {
    await axios.post(webhookUrl, {
      text: `🚨 *SiteGuard Alert*\n${message}`,
    });
  } catch (err) {
    console.error('Slack alert failed:', err);
  }
};
