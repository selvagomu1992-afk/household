import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  category: { type: String, required: true },
  label: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  note: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Income', incomeSchema);
