import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { pool } from './db';

async function main() {
  const manager = await bcrypt.hash('Gerente@123', 10);
  const cashier = await bcrypt.hash('Caixa@123', 10);

  const [users] = await pool.query<any[]>('SELECT email FROM users WHERE email IN (?, ?)', ['gerente@ms2.local', 'caixa@ms2.local']);
  const emails = new Set(users.map((u:any) => u.email));
  if (!emails.has('gerente@ms2.local')) await pool.query('INSERT INTO users(id,name,email,password_hash,role) VALUES (?,?,?,?,?)', [randomUUID(),'Gerente MS²','gerente@ms2.local',manager,'MANAGER']);
  if (!emails.has('caixa@ms2.local')) await pool.query('INSERT INTO users(id,name,email,password_hash,role) VALUES (?,?,?,?,?)', [randomUUID(),'Caixa MS²','caixa@ms2.local',cashier,'CASHIER']);

  const [products] = await pool.query<any[]>('SELECT code FROM products WHERE code IN (?,?,?)', ['CAM-001','CAL-001','BON-001']);
  const codes = new Set(products.map((p:any) => p.code));
  const seedProducts = [
    ['CAM-001','Camiseta Básica','Camiseta de algodão',59.90,30],
    ['CAL-001','Calça Jeans','Calça jeans tradicional',149.90,15],
    ['BON-001','Boné MS²','Boné da marca',39.90,20]
  ];
  for (const p of seedProducts) if (!codes.has(p[0])) await pool.query('INSERT INTO products(id,code,name,description,price,stock_quantity) VALUES (?,?,?,?,?,?)', [randomUUID(),...p]);

  await pool.end();
  console.log('Seed MySQL concluído.');
}
main().catch(async e => { console.error(e); await pool.end(); process.exit(1); });
