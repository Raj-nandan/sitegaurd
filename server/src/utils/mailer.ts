import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAlert = async (to: string, subject: string, text: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"SiteGuard" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fafaf8; border-radius: 12px; border: 1px solid rgba(0,0,0,0.08);">
          <h2 style="color: #141412; margin-bottom: 16px;">⚠️ SiteGuard Alert</h2>
          <p style="color: #5a5a54; line-height: 1.6;">${text}</p>
          <hr style="border: none; border-top: 1px solid rgba(0,0,0,0.08); margin: 24px 0;" />
          <p style="color: #9a9a92; font-size: 12px;">SiteGuard — Website monitoring for freelancers</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email alert failed:', err);
  }
};
