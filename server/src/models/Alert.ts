import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  clientId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'down' | 'slow' | 'ssl' | 'domain';
  message: string;
  resolved: boolean;
  createdAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['down', 'slow', 'ssl', 'domain'], required: true },
    message: { type: String, required: true },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IAlert>('Alert', AlertSchema);
