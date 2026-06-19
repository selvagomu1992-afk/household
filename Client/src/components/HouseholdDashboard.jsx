import { useState } from 'react';
import { getItemByKey } from '../data/categories';
import Sidebar from './Sidebar';
import CategoryManager from './CategoryManager';
import ExportModal from './ExportModal';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function nowISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function HouseholdDashboard({
  expenses, incomes, headings, incomeCategories,
  onAddExpense, onUpdateExpense, onDeleteExpense,
  onAddIncome, onUpdateIncome, onDeleteIncome,
  user, onLogout, onRefresh, onAddHeading, onAddItem, onDeleteHeading, onDeleteItem,
}) {
  const [selectedKey, setSelectedKey] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [dateTime, setDateTime] = useState(nowISO());
  const [editingId, setEditingId] = useState(null);
  const [showManager, setShowManager] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const isIncome = incomeCategories?.items?.some((i) => i.key === selectedKey) || false;
  const selectedExpense = selectedKey && !isIncome ? getItemByKey(headings, selectedKey) : null;
  const selectedIncome = selectedKey && isIncome ? incomeCategories?.items?.find((i) => i.key === selectedKey) : null;
  const selected = selectedExpense || selectedIncome;
  const headingName = selectedIncome ? incomeCategories?.title : selectedExpense?.heading || '';

  const thisMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const thisMonthIncomes = incomes.filter((i) => {
    const d = new Date(i.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const grandTotal = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const monthlyExpenses = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const monthlyIncome = thisMonthIncomes.reduce((s, i) => s + i.amount, 0);
  const netTotal = totalIncome - grandTotal;
  const monthlyNet = monthlyIncome - monthlyExpenses;

  const dataList = isIncome ? incomes : expenses;
  const dataFiltered = selectedKey
    ? dataList.filter((d) => isIncome ? d.category === selectedKey : d.subCategory === selectedKey)
    : [];
  const selectedTotal = dataFiltered.reduce((s, d) => s + d.amount, 0);
  const selectedSorted = [...dataFiltered].sort((a, b) => new Date(b.date) - new Date(a.date));

  function resetForm() {
    setAmount('');
    setNote('');
    setDateTime(nowISO());
    setEditingId(null);
  }

  async function handleSubmit() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !selected) return;
    const localDate = new Date(dateTime);
    const isoDate = localDate.toISOString();

    if (isIncome) {
      if (editingId) {
        const ok = await onUpdateIncome(editingId, {
          category: selectedKey, label: selected.label, amount: amt, date: isoDate, note: note || '',
        });
        if (ok) resetForm();
      } else {
        const ok = await onAddIncome({
          category: selectedKey, label: selected.label, amount: amt, date: isoDate, note: note || '',
        });
        if (ok) resetForm();
      }
    } else {
      if (editingId) {
        const ok = await onUpdateExpense(editingId, {
          subCategory: selectedKey, label: selected.label, amount: amt, date: isoDate, note: note || '',
        });
        if (ok) resetForm();
      } else {
        const ok = await onAddExpense({
          subCategory: selectedKey, label: selected.label, amount: amt, date: isoDate, note: note || '',
        });
        if (ok) resetForm();
      }
    }
  }

  function startEdit(entry) {
    setEditingId(entry._id);
    setAmount(String(entry.amount));
    setNote(entry.note || '');
    const d = new Date(entry.date);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    setDateTime(local.toISOString().slice(0, 16));
  }

  function handleDelete(id) {
    if (isIncome) onDeleteIncome(id);
    else onDeleteExpense(id);
  }

  const headingTotals = {};
  headings.forEach((h) => {
    headingTotals[h.headingId] = expenses
      .filter((e) => {
        const item = getItemByKey(headings, e.subCategory);
        return item && item.headingId === h.headingId;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  });

  function quickCSV() {
    const rows = [
      ['Type', 'Category', 'Label', 'Amount', 'Date', 'Note'],
      ...expenses.map((e) => ['Expense', e.subCategory, e.label, e.amount.toFixed(2), new Date(e.date).toISOString().slice(0, 10), e.note || '']),
      ...incomes.map((i) => ['Income', i.category, i.label, i.amount.toFixed(2), new Date(i.date).toISOString().slice(0, 10), i.note || '']),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `all_data_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="app-layout">
      <Sidebar
        headings={headings}
        selectedKey={selectedKey}
        onSelect={(key) => { setSelectedKey(key); resetForm(); }}
        onManage={() => setShowManager(true)}
        incomeCategories={incomeCategories}
      />

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            {selected ? (
              <button className="topbar-back" onClick={() => { setSelectedKey(null); resetForm(); }}>← Back</button>
            ) : null}
            <span className="topbar-greeting">
              {selected ? `${selected.icon} ${selected.label}` : '📊 All Categories'}
            </span>
            <span className="topbar-sub">
              {selected ? headingName : 'Overview'}
            </span>
          </div>
          <div className="topbar-right">
            <span className="hh-user">{user?.name || user?.phone}</span>
            <button className="refresh-btn" onClick={() => { setSelectedKey(null); resetForm(); onRefresh(); }} title="Refresh">🔄</button>
            <button className="download-btn" onClick={quickCSV}>⬇ CSV</button>
            <button className="download-btn" onClick={() => setShowExport(true)}>⬇ Export</button>
            <button className="logout-btn" onClick={onLogout}>Sign Out</button>
          </div>
        </header>

        <div className="content-scroll">
          <div className="hh-summary">
            {!selectedKey ? (
              <>
                <div className="hh-summary-card hh-card-income">
                  <div className="hh-summary-label">Total Income</div>
                  <div className="hh-summary-value hh-green">₹{totalIncome.toFixed(2)}</div>
                </div>
                <div className="hh-summary-card hh-card-expense">
                  <div className="hh-summary-label">Total Expenses</div>
                  <div className="hh-summary-value hh-red">₹{grandTotal.toFixed(2)}</div>
                </div>
                <div className="hh-summary-card">
                  <div className="hh-summary-label">Net</div>
                  <div className={`hh-summary-value ${netTotal >= 0 ? 'hh-green' : 'hh-red'}`}>
                    {netTotal >= 0 ? '+' : ''}₹{netTotal.toFixed(2)}
                  </div>
                </div>
                <div className="hh-summary-card">
                  <div className="hh-summary-label">This Month ({MONTHS[currentMonth]})</div>
                  <div className={`hh-summary-value ${monthlyNet >= 0 ? 'hh-green' : 'hh-red'}`}>
                    ₹{monthlyNet.toFixed(2)}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="hh-summary-card">
                  <div className="hh-summary-label">
                    {isIncome ? 'Total Income' : 'Total Expenses'}
                  </div>
                  <div className="hh-summary-value">
                    ₹{(isIncome ? totalIncome : grandTotal).toFixed(2)}
                  </div>
                </div>
                <div className="hh-summary-card">
                  <div className="hh-summary-label">
                    This Month ({MONTHS[currentMonth]})
                  </div>
                  <div className="hh-summary-value hh-green">
                    ₹{(isIncome ? monthlyIncome : monthlyExpenses).toFixed(2)}
                  </div>
                </div>
                <div className="hh-summary-card">
                  <div className="hh-summary-label">{selected?.label}</div>
                  <div className={`hh-summary-value ${isIncome ? 'hh-green' : 'hh-blue'}`}>
                    ₹{selectedTotal.toFixed(2)}
                  </div>
                </div>
              </>
            )}
          </div>

          {selected && (
            <div className="detail-view">
              <div className="detail-header">
                <span className="detail-icon">{selected.icon}</span>
                <div>
                  <div className="detail-title">{selected.label}</div>
                  <div className="detail-heading">{headingName}</div>
                </div>
                <div className={`detail-total ${isIncome ? 'hh-green' : ''}`}>
                  ₹{selectedTotal.toFixed(2)}
                </div>
              </div>

              <div className="detail-form">
                <h3 className="detail-form-title">
                  {editingId ? '✏️ Edit' : '➕ Quick Add'}
                </h3>
                <div className="detail-form-row">
                  <input
                    type="number" step="0.01" min="0" placeholder="Amount"
                    className="form-input" value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <input
                    type="text" placeholder="Note (optional)"
                    className="form-input" value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <div className="detail-form-row" style={{ marginTop: 10 }}>
                  <input
                    type="datetime-local" className="form-input"
                    value={dateTime} onChange={(e) => setDateTime(e.target.value)}
                  />
                </div>
                <div className="detail-form-actions">
                  <button className="btn btn-primary detail-add-btn" onClick={handleSubmit} disabled={!amount}>
                    {editingId ? 'Update' : 'Add'}
                  </button>
                  {editingId && (
                    <button className="btn btn-cancel" onClick={resetForm}>Cancel</button>
                  )}
                </div>
              </div>

              <div className="detail-entries">
                <h3 className="detail-form-title">📋 History</h3>
                {selectedSorted.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <p>No records yet.</p>
                  </div>
                ) : (
                  <div className="detail-list">
                    {selectedSorted.map((entry) => (
                      <div key={entry._id} className="detail-row">
                        <div className="detail-row-left">
                          <span className="detail-row-note">{entry.note || selected.label}</span>
                          <span className="detail-row-date">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="detail-row-right">
                          <span className={`detail-row-amt ${isIncome ? 'hh-green' : ''}`}>
                            ₹{entry.amount.toFixed(2)}
                          </span>
                          <button className="detail-row-edit" onClick={() => startEdit(entry)} title="Edit">✏️</button>
                          <button className="detail-row-del" onClick={() => handleDelete(entry._id)} title="Delete">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!selected && (
            <div className="all-categories">
              {headings.map((heading) => {
                const hTotal = headingTotals[heading.headingId] || 0;
                return (
                  <div key={heading.headingId} className="heading-section">
                    <div className="heading-section-title">
                      <span>{heading.icon}</span>
                      <span>{heading.title}</span>
                      <span className="heading-section-total">₹{hTotal.toFixed(2)}</span>
                    </div>
                    <div className="heading-section-grid">
                      {heading.items.map((item) => {
                        const itemTotal = expenses
                          .filter((e) => e.subCategory === item.key)
                          .reduce((s, e) => s + e.amount, 0);
                        return (
                          <div
                            key={item.key}
                            className="heading-item-card"
                            onClick={() => { setSelectedKey(item.key); resetForm(); }}
                          >
                            <div className="heading-item-top">
                              <span className="heading-item-icon">{item.icon}</span>
                              <span className="heading-item-amt">₹{itemTotal.toFixed(2)}</span>
                            </div>
                            <div className="heading-item-label">{item.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {incomeCategories && (
                <div className="heading-section">
                  <div className="heading-section-title">
                    <span>{incomeCategories.icon}</span>
                    <span>{incomeCategories.title}</span>
                    <span className="heading-section-total hh-green">₹{totalIncome.toFixed(2)}</span>
                  </div>
                  <div className="heading-section-grid">
                    {incomeCategories.items.map((item) => {
                      const itemTotal = incomes
                        .filter((i) => i.category === item.key)
                        .reduce((s, i) => s + i.amount, 0);
                      return (
                        <div
                          key={item.key}
                          className="heading-item-card"
                          onClick={() => { setSelectedKey(item.key); resetForm(); }}
                        >
                          <div className="heading-item-top">
                            <span className="heading-item-icon">{item.icon}</span>
                            <span className="heading-item-amt hh-green">₹{itemTotal.toFixed(2)}</span>
                          </div>
                          <div className="heading-item-label">{item.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showManager && (
        <CategoryManager
          headings={headings}
          onAddHeading={onAddHeading}
          onAddItem={onAddItem}
          onDeleteHeading={onDeleteHeading}
          onDeleteItem={onDeleteItem}
          onClose={() => setShowManager(false)}
        />
      )}

      {showExport && (
        <ExportModal
          expenses={expenses}
          incomes={incomes}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}

export default HouseholdDashboard;
