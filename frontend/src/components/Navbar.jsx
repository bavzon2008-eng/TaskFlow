import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ onAdd }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="navbar">
      <div className="brand">TaskFlow</div>
      <span className="nav-link active">Dashboard</span>
      <span className="welcome">Welcome, {user.name.split(' ')[0]}</span>
      <div className="nav-actions">
        <button className="btn primary" onClick={onAdd}>+ Add task</button>
        <button className="btn ghost" onClick={() => { logout(); nav('/login'); }}>Sign out</button>
      </div>
    </header>
  );
}
