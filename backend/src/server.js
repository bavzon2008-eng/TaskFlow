import 'dotenv/config';
import app from './app.js';
import { pool } from './db.js';

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  console.error('Missing JWT_SECRET or DATABASE_URL. Copy .env.example to .env and fill it in.');
  process.exit(1);
}
try { await pool.query('SELECT 1'); console.log('PostgreSQL connected.'); }
catch (e) { console.error('Cannot connect to PostgreSQL:', e.message); process.exit(1); }
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
