import fs from 'node:fs';
import path from 'node:path';
import { pool } from './db';

async function main() {
  const sql = fs.readFileSync(path.resolve(__dirname, '../../../database/schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Banco MySQL inicializado.');
  await pool.end();
}
main().catch(async e => { console.error(e); await pool.end(); process.exit(1); });
