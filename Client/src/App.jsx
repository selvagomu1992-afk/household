import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import HouseholdDashboard from './components/HouseholdDashboard';
import { INCOME_CATEGORIES } from './data/categories';

const API = 'https://household-i39j.onrender.com/api/expenses';
const INCOME_API = 'https://household-i39j.onrender.com/api/incomes';
const CAT_API = 'https://household-i39j.onrender.com/api/categories';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('expense_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [headings, setHeadings] = useState([]);

  const token = user?.token;

  function fetchAll() {
    const saved = localStorage.getItem('expense_user');
    const tok = saved ? JSON.parse(saved).token : null;
    if (!tok) return;
    const h = { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` };
    Promise.all([
      fetch(CAT_API, { headers: h }).then((r) => r.ok ? r.json() : []),
      fetch(API, { headers: h }).then((r) => r.ok ? r.json() : []),
      fetch(INCOME_API, { headers: h }).then((r) => r.ok ? r.json() : []),
    ]).then(([cats, exps, incs]) => {
      setHeadings(cats);
      setExpenses(exps);
      setIncomes(incs);
    }).catch(() => {});
  }

  useEffect(() => { fetchAll(); }, []);

  function handleLogin(userData) {
    localStorage.setItem('expense_user', JSON.stringify(userData));
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem('expense_user');
    setUser(null);
    setExpenses([]);
    setIncomes([]);
    setHeadings([]);
  }

  function hdrs() {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  }

  async function addExpense(expense) {
    try {
      const res = await fetch(API, { method: 'POST', headers: hdrs(), body: JSON.stringify(expense) });
      if (res.ok) { const c = await res.json(); setExpenses((p) => [...p, c]); return true; }
    } catch { /* ignore */ }
    return false;
  }

  async function updateExpense(id, updates) {
    try {
      const res = await fetch(`${API}/${id}`, { method: 'PUT', headers: hdrs(), body: JSON.stringify(updates) });
      if (res.ok) { const u = await res.json(); setExpenses((p) => p.map((e) => (e._id === id ? u : e))); return true; }
    } catch { /* ignore */ }
    return false;
  }

  async function deleteExpense(id) {
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: hdrs() });
      if (res.ok) { setExpenses((p) => p.filter((e) => e._id !== id)); return true; }
    } catch { /* ignore */ }
    return false;
  }

  async function addIncome(income) {
    try {
      const res = await fetch(INCOME_API, { method: 'POST', headers: hdrs(), body: JSON.stringify(income) });
      if (res.ok) { const c = await res.json(); setIncomes((p) => [...p, c]); return true; }
    } catch { /* ignore */ }
    return false;
  }

  async function updateIncome(id, updates) {
    try {
      const res = await fetch(`${INCOME_API}/${id}`, { method: 'PUT', headers: hdrs(), body: JSON.stringify(updates) });
      if (res.ok) { const u = await res.json(); setIncomes((p) => p.map((i) => (i._id === id ? u : i))); return true; }
    } catch { /* ignore */ }
    return false;
  }

  async function deleteIncome(id) {
    try {
      const res = await fetch(`${INCOME_API}/${id}`, { method: 'DELETE', headers: hdrs() });
      if (res.ok) { setIncomes((p) => p.filter((i) => i._id !== id)); return true; }
    } catch { /* ignore */ }
    return false;
  }

  async function addHeading(title, icon) {
    try {
      const res = await fetch(`${CAT_API}/heading`, { method: 'POST', headers: hdrs(), body: JSON.stringify({ title, icon }) });
      if (res.ok) { const h = await res.json(); setHeadings((p) => [...p, h]); return true; }
    } catch { /* ignore */ }
    return false;
  }

  async function addItem(headingId, label, icon) {
    try {
      const res = await fetch(`${CAT_API}/${headingId}/item`, { method: 'POST', headers: hdrs(), body: JSON.stringify({ label, icon }) });
      if (res.ok) { const updated = await res.json(); setHeadings((p) => p.map((h) => (h.headingId === headingId ? updated : h))); return true; }
    } catch { /* ignore */ }
    return false;
  }

  async function deleteHeading(headingId) {
    try {
      const res = await fetch(`${CAT_API}/${headingId}`, { method: 'DELETE', headers: hdrs() });
      if (res.ok) { setHeadings((p) => p.filter((h) => h.headingId !== headingId)); return true; }
    } catch { /* ignore */ }
    return false;
  }

  async function deleteItem(headingId, key) {
    try {
      const res = await fetch(`${CAT_API}/${headingId}/item/${key}`, { method: 'DELETE', headers: hdrs() });
      if (res.ok) { const updated = await res.json(); setHeadings((p) => p.map((h) => (h.headingId === headingId ? updated : h))); return true; }
    } catch { /* ignore */ }
    return false;
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <HouseholdDashboard
      expenses={expenses}
      incomes={incomes}
      headings={headings}
      incomeCategories={INCOME_CATEGORIES}
      onAddExpense={addExpense}
      onUpdateExpense={updateExpense}
      onDeleteExpense={deleteExpense}
      onAddIncome={addIncome}
      onUpdateIncome={updateIncome}
      onDeleteIncome={deleteIncome}
      onAddHeading={addHeading}
      onAddItem={addItem}
      onDeleteHeading={deleteHeading}
      onDeleteItem={deleteItem}
      onRefresh={fetchAll}
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default App;
