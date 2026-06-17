import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: String, default: '📦' },
}, { _id: false });

const categorySchema = new mongoose.Schema({
  headingId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  icon: { type: String, default: '📁' },
  items: [itemSchema],
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
