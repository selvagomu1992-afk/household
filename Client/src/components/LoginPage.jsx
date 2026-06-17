import { useState } from 'react';

const AUTH_API = 'http://localhost:5000/api/auth';

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (isRegister && !name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? '/register' : '/login';
      const body = isRegister ? { name: name.trim(), phone: phone.trim() } : { phone: phone.trim() };

      const res = await fetch(`${AUTH_API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      onLogin({ token: data.token, ...data.user });
    } catch {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setIsRegister((prev) => !prev);
    setError('');
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">🏠</span>
          <h1>Household Expense Tracker</h1>
          <p>{isRegister ? 'Create your account' : 'Sign in to manage your expenses'}</p>
        </div>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        <p className="login-toggle">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button className="link-btn" onClick={toggleMode}>
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
