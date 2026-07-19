import mongoose, { Schema } from 'mongoose';

const AgentSchema = new Schema({
  title: { type: String, required: true },
  shortDesc: { type: String, required: true },
  fullDesc: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true, default: 'Data Analyzer' },
  imageUrl: { type: String, default: '' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.models.Agent || mongoose.model('Agent', AgentSchema);