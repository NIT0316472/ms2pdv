import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from '../config/db';
import { env } from '../config/env';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  const { email, password } = parsed.data;
  const result = await query('SELECT id,name,email,password_hash,role FROM users WHERE email=?', [email]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ message: 'Credenciais inválidas.' });
  const safe = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = jwt.sign(safe, env.jwtSecret, { expiresIn: '8h' });
  return res.json({ token, user: safe });
}

export async function me(req: Request, res: Response) { return res.json({ user: req.user }); }
