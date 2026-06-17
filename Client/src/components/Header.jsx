function Header({ activeTab, onTabChange }) {
  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">💰</span>
        <h1>Household Expense Tracker</h1>
      </div>
      <nav className="header-nav">
        <button
          className={`nav-btn${activeTab === 'dashboard' ? ' active' : ''}`}
          onClick={() => onTabChange('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-btn${activeTab === 'add' ? ' active' : ''}`}
          onClick={() => onTabChange('add')}
        >
          + Add
        </button>
        <button
          className={`nav-btn${activeTab === 'history' ? ' active' : ''}`}
          onClick={() => onTabChange('history')}
        >
          History
        </button>
      </nav>
    </header>
  );
}

export default Header;
