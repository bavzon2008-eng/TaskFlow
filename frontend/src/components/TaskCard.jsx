import ProgressBar from './ProgressBar.jsx';
import { daysOverdue, fmtCreated, fmtDate } from '../utils.js';

export default function TaskCard({ task, number, busy, onEdit, onDelete }) {
  const late = daysOverdue(task);
  return (
    <article className={`card${busy ? ' busy' : ''}${late ? ' late' : ''}`}>
      <div className="card-top">
        <span className="num">#{number}</span>
        <span className={`badge s-${task.status.replace(' ', '').toLowerCase()}`}>{task.status}</span>
      </div>
      <div className="due">📅 Due: {fmtDate(task.due_date)}</div>
      {late > 0 && <div className="overdue">Overdue by {late} day{late > 1 ? 's' : ''}</div>}
      <h3>{task.title}</h3>
      <p className="desc">{task.description || 'No description.'}</p>
      <div className="meta">
        <span className={`prio p-${task.priority.toLowerCase()}`}>{task.priority} priority</span>
        <span className="created">Created {fmtCreated(task.created_at)}</span>
      </div>
      <div className="prog-row"><span>Progress</span><strong>{task.progress}%</strong></div>
      <ProgressBar value={task.progress} />
      <div className="card-actions">
        <button className="btn" disabled={busy} onClick={() => onEdit(task)}>Edit</button>
        <button className="btn danger" disabled={busy} onClick={() => onDelete(task)}>{busy ? 'Working…' : 'Delete'}</button>
      </div>
    </article>
  );
}
