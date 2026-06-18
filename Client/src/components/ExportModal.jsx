import { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ExportModal({ expenses, incomes, onClose }) {
  const [type, setType] = useState('all');
  const [range, setRange] = useState('all');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filtered = useMemo(() => {
    const all = [];
    if (type === 'all' || type === 'expense') {
      expenses.forEach((e) => all.push({ ...e, _type: 'Expense' }));
    }
    if (type === 'all' || type === 'income') {
      incomes.forEach((i) => all.push({ ...i, _type: 'Income', subCategory: i.category }));
    }
    return all.filter((item) => {
      const d = new Date(item.date);
      if (range === 'month') {
        return d.getMonth() === month && d.getFullYear() === year;
      }
      if (range === 'custom') {
        if (fromDate && d < new Date(fromDate)) return false;
        if (toDate) {
          const end = new Date(toDate);
          end.setDate(end.getDate() + 1);
          if (d >= end) return false;
        }
      }
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, incomes, type, range, month, year, fromDate, toDate]);

  const total = filtered.reduce((s, r) => s + r.amount, 0);

  function csvRow(row) {
    return row.map((c) => `"${c}"`).join(',');
  }

  function downloadCSV() {
    const header = ['Type', 'Category', 'Label', 'Amount', 'Date', 'Note'];
    const rows = filtered.map((r) => [
      r._type, r.subCategory, r.label, r.amount.toFixed(2),
      new Date(r.date).toISOString().slice(0, 10), r.note || '',
    ]);
    const csv = [csvRow(header), ...rows.map(csvRow)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function downloadPDF() {
    const doc = new jsPDF();

    let title = 'Expense Report';
    if (range === 'month') title += ` - ${MONTHS[month]} ${year}`;
    if (range === 'custom') title += ` (${fromDate || '…'} to ${toDate || '…'})`;

    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total: Rs.${total.toFixed(2)}`, 14, 35);

    const headers = [['Type', 'Category', 'Label', 'Amount (Rs.)', 'Date', 'Note']];
    const data = filtered.map((r) => [
      r._type, r.subCategory, r.label, r.amount.toFixed(2),
      new Date(r.date).toISOString().slice(0, 10), r.note || '',
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74] },
    });

    doc.save(`export_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Export</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="export-section">
            <label className="export-label">Type</label>
            <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All (Expense + Income)</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Incomes Only</option>
            </select>
          </div>

          <div className="export-section">
            <label className="export-label">Date Range</label>
            <select className="form-input" value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="all">All Time</option>
              <option value="month">Specific Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {range === 'month' && (
            <div className="export-row">
              <select className="form-input" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select className="form-input" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}

          {range === 'custom' && (
            <div className="export-row">
              <input type="date" className="form-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} placeholder="From" />
              <input type="date" className="form-input" value={toDate} onChange={(e) => setToDate(e.target.value)} placeholder="To" />
            </div>
          )}

          <div className="export-summary">
            {filtered.length} entries · Total: ₹{total.toFixed(2)}
          </div>

          <div className="export-actions">
            <button className="btn btn-primary" onClick={downloadCSV}>⬇ Download CSV</button>
            <button className="btn btn-primary" onClick={downloadPDF}>⬇ Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
