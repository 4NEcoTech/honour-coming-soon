import mongoose from 'mongoose';

const VideoKYCSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  roomId: { type: String, unique: true, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

export default mongoose.models.VideoKYCSession || mongoose.model('VideoKYCSession', VideoKYCSchema);
