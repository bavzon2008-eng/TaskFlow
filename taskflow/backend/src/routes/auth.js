import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const sign = (id) => jwt.sign({ sub: id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = (u) => ({ id: u.id, name: u.name, email: u.email, created_at: u.created_at });

r.post('/signup', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const confirmPassword = String(req.body.confirmPassword || '');
    if (!name || !email || !password || !confirmPassword) return res.status(400).json({ error: 'All fields are required.' });
    if (name.length > 100) return res.status(400).json({ error: 'Name is too long.' });
    if (!EMAIL.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match.' });
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      'INSERT INTO users (name,email,password_hash) VALUES ($1,$2,$3) RETURNING id,name,email,created_at', [name, email, hash]);
    res.status(201).json({ token: sign(rows[0].id), user: pub(rows[0]) });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'An account with this email already exists.' });
    next(e);
  }
});

r.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const ok = rows[0] && (await bcrypt.compare(password, rows[0].password_hash));
    if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });
    res.json({ token: sign(rows[0].id), user: pub(rows[0]) });
  } catch (e) { next(e); }
});

r.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id,name,email,created_at FROM users WHERE id=$1', [req.userId]);
    if (!rows[0]) return res.status(401).json({ error: 'Please log in to continue.' });
    res.json({ user: rows[0] });
  } catch (e) { next(e); }
});
export default r;
