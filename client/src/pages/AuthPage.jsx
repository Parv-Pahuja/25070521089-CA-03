import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// One form used for both /login and /signup
function AuthPage({ mode }) {
  const isSignup = mode === 'signup';
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const goTo = location.state?.from || '/';

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={goTo} replace />;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isSignup && !form.name.trim()) return setError('Please enter your name.');
    if (!form.email.trim() || !form.password) return setError('Please enter your email and password.');
    if (isSignup && form.password.length < 6) return setError('Password must be at least 6 characters.');

    setBusy(true);
    try {
      if (isSignup) await signup(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate(goTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot reach the server. Is it running?');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-box">
      <h1>{isSignup ? 'Join Orbit' : 'Welcome back'}</h1>
      <p className="meta">
        {isSignup ? 'Create an account to comment, react and save articles.' : 'Log in to comment, react and save articles.'}
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        {isSignup && (
          <label>
            Name
            <input name="name" value={form.name} maxLength={40} onChange={change} autoComplete="name" />
          </label>
        )}
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={change} autoComplete="email" />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={change}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn" disabled={busy}>
          {busy ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
        </button>
      </form>

      <p className="meta auth-switch">
        {isSignup ? (
          <>Already have an account? <Link to="/login" state={location.state}>Log in</Link></>
        ) : (
          <>New here? <Link to="/signup" state={location.state}>Create an account</Link></>
        )}
      </p>
    </div>
  );
}

export default AuthPage;
