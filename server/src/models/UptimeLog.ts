import mongoose, { Document, Schema } from 'mongoose';

export interface IUptimeLog extends Document {
  clientId: mongoose.Types.ObjectId;
  status: 'up' | 'down' | 'warn';
  responseMs: number;
  statusCode: number;
  checkedAt: Date;
}

const UptimeLogSchema = new Schema<IUptimeLog>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  status: { type: String, enum: ['up', 'down', 'warn'], required: true },
  responseMs: { type: Number, default: 0 },
  statusCode: { type: Number, default: 200 },
  checkedAt: { type: Date, default: Date.now },
});

UptimeLogSchema.index({ clientId: 1, checkedAt: -1 });

export default mongoose.model<IUptimeLog>('UptimeLog', UptimeLogSchema);
