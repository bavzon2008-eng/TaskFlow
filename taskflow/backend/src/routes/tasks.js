import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.use(requireAuth);
const STATUS = ['Not Started', 'In Progress', 'Completed'];
const PRIORITY = ['Low', 'Medium', 'High'];
const COLS = 'id,title,description,status,progress,priority,due_date,created_at,updated_at';

function clean(b) {
  const title = String(b.title ?? '').trim();
  if (!title) return { error: 'Task title is required.' };
  if (title.length > 200) return { error: 'Task title must be 200 characters or fewer.' };
  const description = String(b.description ?? '').trim().slice(0, 2000);
  const priority = b.priority ?? 'Medium';
  if (!PRIORITY.includes(priority)) return { error: 'Invalid priority.' };
  let status = b.status ?? 'Not Started';
  if (!STATUS.includes(status)) return { error: 'Invalid status.' };
  let progress = Number(b.progress ?? 0);
  if (!Number.isInteger(progress) || progress < 0 || progress > 100) return { error: 'Progress must be between 0 and 100.' };
  const due = b.due_date || null;
  if (due && (!/^\d{4}-\d{2}-\d{2}$/.test(due) || Number.isNaN(Date.parse(due)))) return { error: 'Invalid due date.' };
  if (status === 'Completed') progress = 100;
  else if (progress === 100) status = 'Completed';
  else if (status === 'Not Started') progress = 0;
  return { v: { title, description, priority, status, progress, due } };
}
const notFound = (res) => res.status(404).json({ error: 'Task not found.' });
const validId = (id) => /^\d{1,9}$/.test(id);

r.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT ${COLS} FROM tasks WHERE user_id=$1 ORDER BY created_at DESC, id DESC`, [req.userId]);
    res.json({ tasks: rows });
  } catch (e) { next(e); }
});

r.get('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return notFound(res);
    const { rows } = await pool.query(`SELECT ${COLS} FROM tasks WHERE id=$1 AND user_id=$2`, [req.params.id, req.userId]);
    rows[0] ? res.json({ task: rows[0] }) : notFound(res);
  } catch (e) { next(e); }
});

r.post('/', async (req, res, next) => {
  try {
    const { v, error } = clean(req.body);
    if (error) return res.status(400).json({ error });
    const { rows } = await pool.query(
      `INSERT INTO tasks (user_id,title,description,status,progress,priority,due_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING ${COLS}`,
      [req.userId, v.title, v.description, v.status, v.progress, v.priority, v.due]);
    res.status(201).json({ task: rows[0] });
  } catch (e) { next(e); }
});

r.put('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return notFound(res);
    const { v, error } = clean(req.body);
    if (error) return res.status(400).json({ error });
    const { rows } = await pool.query(
      `UPDATE tasks SET title=$1,description=$2,status=$3,progress=$4,priority=$5,due_date=$6,updated_at=NOW()
       WHERE id=$7 AND user_id=$8 RETURNING ${COLS}`,
      [v.title, v.description, v.status, v.progress, v.priority, v.due, req.params.id, req.userId]);
    rows[0] ? res.json({ task: rows[0] }) : notFound(res);
  } catch (e) { next(e); }
});

r.delete('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return notFound(res);
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id=$1 AND user_id=$2', [req.params.id, req.userId]);
    rowCount ? res.json({ ok: true }) : notFound(res);
  } catch (e) { next(e); }
});
export default r;
