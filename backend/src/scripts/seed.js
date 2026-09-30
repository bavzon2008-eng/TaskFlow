import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
try {
  const hash = await bcrypt.hash('Demo@1234', 12);
  const { rows } = await pool.query(
    `INSERT INTO users (name,email,password_hash) VALUES ('Demo User','demo@example.com',$1)
     ON CONFLICT (email) DO UPDATE SET password_hash=EXCLUDED.password_hash RETURNING id`, [hash]);
  const uid = rows[0].id;
  await pool.query('DELETE FROM tasks WHERE user_id=$1', [uid]);
  const t = [
    ['Task Management Application','Develop a task management web application for creating, updating, and tracking tasks.','In Progress',70,'High',5],
    ['Write project report','Summarise the architecture and testing results.','Not Started',0,'Medium',14],
    ['Design database schema','Users and tasks tables with constraints.','Completed',100,'High',-20],
    ['Prepare demo slides','Ten slides for the final presentation.','In Progress',30,'Medium',-11],
    ['Review peer feedback','Collect and apply comments from classmates.','Not Started',0,'Low',-3],
    ['Deploy to staging','Set up hosting and environment variables.','In Progress',50,'Low',21],
  ];
  for (const [ti,d,s,p,pr,off] of t)
    await pool.query(`INSERT INTO tasks (user_id,title,description,status,progress,priority,due_date)
      VALUES ($1,$2,$3,$4,$5,$6,CURRENT_DATE + $7::int)`, [uid,ti,d,s,p,pr,off]);
  console.log('Seeded. Login: demo@example.com / Demo@1234');
} catch (e) { console.error('Seed failed:', e.message); process.exitCode = 1; }
finally { await pool.end(); }
