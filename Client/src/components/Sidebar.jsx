import { useState } from 'react';

function Sidebar({ headings, selectedKey, onSelect, onManage, incomeCategories }) {
  const incomeId = incomeCategories?.headingId || 'income';
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(() => {
    const map = {};
    map[incomeId] = incomeCategories?.items?.some((i) => i.key === selectedKey) || false;
    headings.forEach((h) => {
      map[h.headingId] = h.items.some((i) => i.key === selectedKey);
    });
    if (!Object.values(map).some(Boolean)) {
      if (incomeCategories?.items?.length) map[incomeId] = true;
      else if (headings.length > 0) map[headings[0].headingId] = true;
    }
    return map;
  });

  function toggle(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSelect(key) {
    onSelect(key);
    setOpen(false);
  }

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
        {open ? '✕' : '☰'}
      </button>

      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
        <div className="sidebar-brand" onClick={() => handleSelect(null)}>
          <span className="sidebar-logo">💰</span>
          <div>
            <div className="sidebar-title">Expense Tracker</div>
            <div className="sidebar-sub">All Categories</div>
          </div>
        </div>

        <button className="sidebar-manage" onClick={() => { onManage(); setOpen(false); }}>
          ⚙️ Manage Categories
        </button>

        <nav className="sidebar-nav">
          {incomeCategories && (
            <div className="sidebar-group">
              <button
                className={`sidebar-heading${expanded[incomeId] ? ' expanded' : ''} sidebar-heading-income`}
                onClick={() => toggle(incomeId)}
              >
                <span className="sh-icon">{incomeCategories.icon}</span>
                <span className="sh-title">{incomeCategories.title}</span>
                <span className="sh-arrow">{expanded[incomeId] ? '▾' : '▸'}</span>
              </button>
              {expanded[incomeId] && (
                <div className="sidebar-items">
                  {incomeCategories.items.map((item) => (
                    <button
                      key={item.key}
                      className={`sidebar-item${selectedKey === item.key ? ' active' : ''}`}
                      onClick={() => handleSelect(item.key)}
                    >
                      <span className="si-icon">{item.icon}</span>
                      <span className="si-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {headings.map((heading) => (
            <div key={heading.headingId} className="sidebar-group">
              <button
                className={`sidebar-heading${expanded[heading.headingId] ? ' expanded' : ''}`}
                onClick={() => toggle(heading.headingId)}
              >
                <span className="sh-icon">{heading.icon}</span>
                <span className="sh-title">{heading.title}</span>
                <span className="sh-arrow">{expanded[heading.headingId] ? '▾' : '▸'}</span>
              </button>
              {expanded[heading.headingId] && (
                <div className="sidebar-items">
                  {heading.items.map((item) => (
                    <button
                      key={item.key}
                      className={`sidebar-item${selectedKey === item.key ? ' active' : ''}`}
                      onClick={() => handleSelect(item.key)}
                    >
                      <span className="si-icon">{item.icon}</span>
                      <span className="si-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
