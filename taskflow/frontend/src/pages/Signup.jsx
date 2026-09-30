import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthShell from './AuthForm.jsx';

export default function Signup() {
  const { user, signup } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (Object.values(f).some((v) => !v.trim())) return setErr('All fields are required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) return setErr('Enter a valid email address.');
    if (f.password.length < 8) return setErr('Password must be at least 8 characters.');
    if (f.password !== f.confirmPassword) return setErr('Passwords do not match.');
    setBusy(true); setErr('');
    try { await signup(f); nav('/dashboard'); } catch (ex) { setErr(ex.message); setBusy(false); }
  };
  return (
    <AuthShell title="Create your account" sub="Your tasks stay saved and private to you.">
      <form onSubmit={submit} className="stack">
        {err && <div className="alert">{err}</div>}
        <label>Full name<input autoComplete="name" value={f.name} onChange={on('name')} /></label>
        <label>Email<input type="email" autoComplete="email" value={f.email} onChange={on('email')} /></label>
        <label>Password (8+ characters)<input type="password" autoComplete="new-password" value={f.password} onChange={on('password')} /></label>
        <label>Confirm password<input type="password" autoComplete="new-password" value={f.confirmPassword} onChange={on('confirmPassword')} /></label>
        <button className="btn primary block" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
      <p className="switch">Already registered? <Link to="/login">Sign in</Link></p>
    </AuthShell>
  );
}
