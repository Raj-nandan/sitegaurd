import mongoose, { Document, Schema } from 'mongoose';

export interface IMonthlyReport extends Document {
  clientId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  stats: {
    uptimePercent: number;
    avgResponseMs: number;
    incidents: number;
    totalChecks: number;
  };
  generatedAt: Date;
}

const MonthlyReportSchema = new Schema<IMonthlyReport>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    stats: {
      uptimePercent: { type: Number, default: 100 },
      avgResponseMs: { type: Number, default: 0 },
      incidents: { type: Number, default: 0 },
      totalChecks: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

MonthlyReportSchema.add({ generatedAt: { type: Date, default: Date.now } });

export default mongoose.model<IMonthlyReport>('MonthlyReport', MonthlyReportSchema);
