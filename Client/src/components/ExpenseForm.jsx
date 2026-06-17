import { useState } from 'react';

const CATEGORIES = ['Food', 'Utilities', 'Rent', 'Transport', 'Healthcare', 'Entertainment', 'Shopping', 'Other'];

function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    onAdd({
      id: Date.now(),
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date,
    });
    setTitle('');
    setAmount('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
  }

  return (
    <div className="section">
      <div className="section-title">➕ Add New Expense</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="e.g. Groceries"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={!title.trim() || !amount}>
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
