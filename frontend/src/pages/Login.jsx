import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthShell from './AuthForm.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!f.email || !f.password) return setErr('Enter your email and password.');
    setBusy(true); setErr('');
    try { await login(f); nav('/dashboard'); } catch (ex) { setErr(ex.message); setBusy(false); }
  };
  return (
    <AuthShell title="Sign in" sub="Pick up where you left off.">
      <form onSubmit={submit} className="stack">
        {err && <div className="alert">{err}</div>}
        <label>Email<input type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label>Password<input type="password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        <button className="btn primary block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="switch">New here? <Link to="/signup">Create an account</Link></p>
    </AuthShell>
  );
}
