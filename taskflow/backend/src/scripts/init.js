import fs from 'fs';
import { pool } from '../db.js';
const sql = fs.readFileSync(new URL('../../schema.sql', import.meta.url), 'utf8');
try { await pool.query(sql); console.log('Database schema ready.'); }
catch (e) { console.error('Schema failed:', e.message); process.exitCode = 1; }
finally { await pool.end(); }
