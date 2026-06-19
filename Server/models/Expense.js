import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subCategory: { type: String, required: true },
  label: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  note: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
