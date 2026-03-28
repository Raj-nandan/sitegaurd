import mongoose, { Document, Schema } from 'mongoose';

export type SiteStatus = 'up' | 'down' | 'warn';

export interface IClient extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  url: string;
  contactEmail?: string;
  status: SiteStatus;
  uptime90d: number;
  avgResponseMs: number;
  sslExpiresInDays: number;
  domainExpiresInDays: number;
  lastChecked: Date;
  checkInterval: number;
  alertChannels: string[];
  createdAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    contactEmail: { type: String },
    status: { type: String, enum: ['up', 'down', 'warn'], default: 'up' },
    uptime90d: { type: Number, default: 100 },
    avgResponseMs: { type: Number, default: 0 },
    sslExpiresInDays: { type: Number, default: 90 },
    domainExpiresInDays: { type: Number, default: 365 },
    lastChecked: { type: Date, default: Date.now },
    checkInterval: { type: Number, default: 60 },
    alertChannels: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IClient>('Client', ClientSchema);
