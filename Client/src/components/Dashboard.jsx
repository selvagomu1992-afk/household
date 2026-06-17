const CATEGORY_META = {
  Food: { icon: '🛒', color: '#fef3c7' },
  Utilities: { icon: '⚡', color: '#e0f2fe' },
  Rent: { icon: '🏠', color: '#dbeafe' },
  Transport: { icon: '🚗', color: '#dcfce7' },
  Healthcare: { icon: '🏥', color: '#fce7f3' },
  Entertainment: { icon: '🎬', color: '#ede9fe' },
  Shopping: { icon: '🛍️', color: '#ffedd5' },
  Other: { icon: '📦', color: '#f1f5f9' },
};

function Dashboard({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const thisMonth = expenses.filter((e) => {
    const now = new Date();
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthlyTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);

  const categories = [...new Set(expenses.map((e) => e.category))];

  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  return (
    <>
      <div className="dashboard">
        <div className="card">
          <div className="card-icon">💵</div>
          <div className="card-label">Total Expenses</div>
          <div className="card-value">${total.toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="card-icon">📅</div>
          <div className="card-label">This Month</div>
          <div className="card-value positive">${monthlyTotal.toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="card-icon">📂</div>
          <div className="card-label">Categories</div>
          <div className="card-value">{categories.length}</div>
        </div>
        <div className="card">
          <div className="card-icon">📝</div>
          <div className="card-label">Transactions</div>
          <div className="card-value">{expenses.length}</div>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="section">
          <div className="section-title">📊 Spending by Category</div>
          {Object.entries(categoryTotals).map(([cat, amt]) => {
            const meta = CATEGORY_META[cat] || CATEGORY_META.Other;
            const pct = total > 0 ? ((amt / total) * 100).toFixed(0) : 0;
            return (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                  <span style={{ fontWeight: 500 }}>
                    {meta.icon} {cat}
                  </span>
                  <span style={{ fontWeight: 600 }}>${amt.toFixed(2)}</span>
                </div>
                <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: meta.color === '#fef3c7' ? '#f59e0b' : meta.color === '#e0f2fe' ? '#0ea5e9' : meta.color === '#dbeafe' ? '#3b82f6' : meta.color === '#dcfce7' ? '#10b981' : meta.color === '#fce7f3' ? '#ec4899' : meta.color === '#ede9fe' ? '#8b5cf6' : meta.color === '#ffedd5' ? '#f97316' : '#94a3b8', borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{pct}% of total</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Dashboard;
