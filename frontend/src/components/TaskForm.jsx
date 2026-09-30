import { useState } from 'react';

const STEPS = Array.from({ length: 11 }, (_, i) => i * 10);

export default function TaskForm({ task, onSave, onClose }) {
  const [f, setF] = useState({
    title: task?.title || '', description: task?.description || '', priority: task?.priority || 'Medium',
    due_date: task?.due_date?.slice(0, 10) || '', status: task?.status || 'Not Started', progress: task?.progress ?? 0,
  });
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const setStatus = (status) =>
    setF((p) => ({ ...p, status, progress: status === 'Completed' ? 100 : status === 'Not Started' ? 0 : p.progress === 100 ? 50 : p.progress }));
  const setProgress = (progress) =>
    setF((p) => ({ ...p, progress, status: progress === 100 ? 'Completed' : p.status }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim()) return setErr('Task title is required.');
    setSaving(true); setErr('');
    try { await onSave({ ...f, due_date: f.due_date || null }); }
    catch (ex) { setErr(ex.message); setSaving(false); }
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}>
      <form className="modal" onSubmit={submit}>
        <h2>{task ? 'Edit task' : 'Add task'}</h2>
        {err && <div className="alert">{err}</div>}
        <label>Title<input value={f.title} maxLength={200} onChange={(e) => set('title', e.target.value)} autoFocus /></label>
        <label>Description<textarea rows={3} value={f.description} onChange={(e) => set('description', e.target.value)} /></label>
        <div className="grid2">
          <label>Priority
            <select value={f.priority} onChange={(e) => set('priority', e.target.value)}>
              {['Low', 'Medium', 'High'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label>Due date<input type="date" value={f.due_date} onChange={(e) => set('due_date', e.target.value)} /></label>
          <label>Status
            <select value={f.status} onChange={(e) => setStatus(e.target.value)}>
              {['Not Started', 'In Progress', 'Completed'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label>Progress
            <select value={f.progress} disabled={f.status !== 'In Progress'} onChange={(e) => setProgress(Number(e.target.value))}>
              {STEPS.map((p) => <option key={p} value={p}>{p}%</option>)}
            </select>
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn primary" disabled={saving}>{saving ? 'Saving…' : task ? 'Save changes' : 'Create task'}</button>
        </div>
      </form>
    </div>
  );
}
