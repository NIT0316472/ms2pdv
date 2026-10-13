import { randomUUID } from 'node:crypto';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../config/db';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['MANAGER', 'CASHIER']).default('CASHIER')
});

export function currentUser(req: Request, res: Response) {
  return res.json({ user: req.user });
}

export async function listUsers(req: Request, res: Response) {
  const result = await query<any[]>(
    'SELECT id, name, email, role, created_at FROM users ORDER BY name'
  );

  return res.json(result.rows);
}

export async function getUser(req: Request, res: Response) {
  const result = await query<any[]>(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [req.params.id]
  );

  if (!result.rows.length) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  return res.json(result.rows[0]);
}

export async function createUser(req: Request, res: Response) {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }

  const { name, email, password, role } = parsed.data;

  const exists = await query<any[]>('SELECT id FROM users WHERE email = ?', [email]);
  if (exists.rows.length) {
    return res.status(409).json({ message: 'E-mail já cadastrado.' });
  }

  const id = randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);

  await query(
    'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    [id, name, email, passwordHash, role]
  );

  const created = await query<any[]>(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [id]
  );

  return res.status(201).json(created.rows[0]);
}
