const CATEGORY_COLORS = {
  Food: '#fef3c7',
  Utilities: '#e0f2fe',
  Rent: '#dbeafe',
  Transport: '#dcfce7',
  Healthcare: '#fce7f3',
  Entertainment: '#ede9fe',
  Shopping: '#ffedd5',
  Other: '#f1f5f9',
};

const CATEGORY_ICONS = {
  Food: '🛒',
  Utilities: '⚡',
  Rent: '🏠',
  Transport: '🚗',
  Healthcare: '🏥',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Other: '📦',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ExpenseList({ expenses, onDelete }) {
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="section">
      <div className="section-title">📋 Recent Transactions</div>
      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>No expenses yet. Add your first one!</p>
        </div>
      ) : (
        <ul className="expense-list">
          {sorted.slice(0, 10).map((exp) => (
            <li key={exp.id} className="expense-item">
              <div
                className="expense-cat-icon"
                style={{ background: CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.Other }}
              >
                {CATEGORY_ICONS[exp.category] || '📦'}
              </div>
              <div className="expense-info">
                <div className="expense-title">{exp.title}</div>
                <div className="expense-date">
                  {formatDate(exp.date)} · {exp.category}
                </div>
              </div>
              <div className="expense-amount">${exp.amount.toFixed(2)}</div>
              <button className="expense-delete" onClick={() => onDelete(exp.id)} title="Delete">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseList;
