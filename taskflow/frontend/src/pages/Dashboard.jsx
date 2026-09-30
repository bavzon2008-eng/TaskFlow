import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { isOverdue } from '../utils.js';

const FILTERS = ['All', 'Not Started', 'In Progress', 'Completed', 'Overdue'];
const PRIO = { High: 0, Medium: 1, Low: 2 };
const SORTS = {
  'Due date': (a, b) => (a.due_date || '9999').localeCompare(b.due_date || '9999'),
  Priority: (a, b) => PRIO[a.priority] - PRIO[b.priority],
  Progress: (a, b) => b.progress - a.progress,
  'Recently created': (a, b) => new Date(b.created_at) - new Date(a.created_at),
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Recently created');
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(undefined); // undefined = closed, null = new, task = edit
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    api.listTasks().then((d) => setTasks(d.tasks)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const n = tasks.length;
    return {
      total: n,
      done: tasks.filter((t) => t.status === 'Completed').length,
      doing: tasks.filter((t) => t.status === 'In Progress').length,
      todo: tasks.filter((t) => t.status === 'Not Started').length,
      late: tasks.filter(isOverdue).length,
      overall: n ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / n) : 0,
    };
  }, [tasks]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return tasks
      .filter((t) => (filter === 'All' ? true : filter === 'Overdue' ? isOverdue(t) : t.status === filter))
      .filter((t) => !needle || t.title.toLowerCase().includes(needle) || t.description.toLowerCase().includes(needle))
      .sort(SORTS[sort]);
  }, [tasks, filter, sort, q]);

  const save = async (data) => {
    if (modal) {
      const { task } = await api.updateTask(modal.id, data);
      setTasks((ts) => ts.map((t) => (t.id === task.id ? task : t)));
    } else {
      const { task } = await api.createTask(data);
      setTasks((ts) => [task, ...ts]);
    }
    setModal(undefined);
  };

  const remove = async (task) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setBusyId(task.id); setError('');
    try { await api.deleteTask(task.id); setTasks((ts) => ts.filter((t) => t.id !== task.id)); }
    catch (e) { setError(e.message); }
    finally { setBusyId(null); }
  };

  const summary = [
    ['Total tasks', stats.total], ['Completed', stats.done], ['In progress', stats.doing],
    ['Not started', stats.todo], ['Overdue', stats.late],
  ];

  return (
    <>
      <Navbar onAdd={() => setModal(null)} />
      <main className="wrap">
        {error && <div className="alert">{error}</div>}
        <section className="summary">
          {summary.map(([label, n]) => (
            <div key={label} className={`stat${label === 'Overdue' && n ? ' warn' : ''}`}><strong>{n}</strong><span>{label}</span></div>
          ))}
          <div className="stat overall">
            <div className="prog-row"><span>Overall progress</span><strong>{stats.overall}%</strong></div>
            <ProgressBar value={stats.overall} />
          </div>
        </section>

        <section className="toolbar">
          <input className="search" type="search" placeholder="Search title or description" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort tasks">
            {Object.keys(SORTS).map((s) => <option key={s} value={s}>Sort by: {s}</option>)}
          </select>
        </section>
        <div className="chips">
          {FILTERS.map((f) => (
            <button key={f} className={`chip${filter === f ? ' on' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        {loading ? (
          <div className="empty">Loading your tasks…</div>
        ) : shown.length === 0 ? (
          <div className="empty">
            {tasks.length === 0 ? 'No tasks yet. Add your first task to get started.' : 'No tasks match these filters.'}
          </div>
        ) : (
          <section className="grid">
            {shown.map((t, i) => <TaskCard key={t.id} task={t} number={i + 1} busy={busyId === t.id} onEdit={setModal} onDelete={remove} />)}
          </section>
        )}
      </main>
      {modal !== undefined && <TaskForm task={modal} onSave={save} onClose={() => setModal(undefined)} />}
    </>
  );
}
