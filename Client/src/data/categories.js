const CAT_API = 'https://household-i39j.onrender.com/api/categories';

export function getToken(user) {
  return user?.token || '';
}

async function headers(user) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken(user)}`,
  };
}

export async function fetchHeadings(user) {
  const res = await fetch(CAT_API, { headers: await headers(user) });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function addHeading(user, title, icon) {
  const res = await fetch(`${CAT_API}/heading`, {
    method: 'POST',
    headers: await headers(user),
    body: JSON.stringify({ title, icon }),
  });
  if (!res.ok) throw new Error('Failed to add heading');
  return res.json();
}

export async function addItem(user, headingId, label, icon) {
  const res = await fetch(`${CAT_API}/${headingId}/item`, {
    method: 'POST',
    headers: await headers(user),
    body: JSON.stringify({ label, icon }),
  });
  if (!res.ok) throw new Error('Failed to add item');
  return res.json();
}

export async function deleteHeading(user, headingId) {
  const res = await fetch(`${CAT_API}/${headingId}`, {
    method: 'DELETE',
    headers: await headers(user),
  });
  if (!res.ok) throw new Error('Failed to delete heading');
}

export async function deleteItem(user, headingId, key) {
  const res = await fetch(`${CAT_API}/${headingId}/item/${key}`, {
    method: 'DELETE',
    headers: await headers(user),
  });
  if (!res.ok) throw new Error('Failed to delete item');
}

export const INCOME_CATEGORIES = {
  headingId: 'income',
  title: 'Income',
  icon: '💵',
  items: [
    { key: 'salary_wages', label: 'Salary / Wages', icon: '💼' },
    { key: 'freelance', label: 'Freelance / Side Income', icon: '💻' },
    { key: 'business_income', label: 'Business Income', icon: '📊' },
    { key: 'rental_income', label: 'Rental Income', icon: '🏠' },
    { key: 'investments', label: 'Investments / Dividends', icon: '📈' },
    { key: 'cashback_rewards', label: 'Cashback / Rewards', icon: '🎁' },
    { key: 'gift_prize', label: 'Gift / Prize', icon: '🎀' },
    { key: 'other_income', label: 'Other Income', icon: '💰' },
  ],
};

export function getItemByKey(headings, key) {
  for (const h of headings) {
    const found = h.items.find((i) => i.key === key);
    if (found) return { ...found, heading: h.title, headingId: h.headingId };
  }
  return null;
}
