import 'dotenv/config';
import pg from 'pg';
pg.types.setTypeParser(1082, (v) => v); // keep DATE columns as 'YYYY-MM-DD' strings
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
