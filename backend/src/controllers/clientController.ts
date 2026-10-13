import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { query } from '../config/db';

const schema = z.object({ name: z.string().min(2), cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'), phone: z.string().optional(), email: z.string().email().optional().or(z.literal('')) });
export async function listClients(req: Request, res: Response) { const r = await query<any[]>('SELECT id,name,cpf,phone,email,created_at FROM clients ORDER BY name'); return res.json(r.rows); }
export async function getClient(req: Request, res: Response) { const r = await query<any[]>('SELECT id,name,cpf,phone,email,created_at FROM clients WHERE id=?',[req.params.id]); if(!r.rows.length)return res.status(404).json({message:'Cliente não encontrado.'}); return res.json(r.rows[0]); }
export async function createClient(req: Request, res: Response) { const p=schema.safeParse(req.body); if(!p.success)return res.status(400).json({message:p.error.issues[0].message}); try { const id=randomUUID(); await query('INSERT INTO clients(id,name,cpf,phone,email) VALUES(?,?,?,?,?)',[id,p.data.name,p.data.cpf,p.data.phone??null,p.data.email||null]); const r=await query<any[]>('SELECT id,name,cpf,phone,email,created_at FROM clients WHERE id=?',[id]); return res.status(201).json(r.rows[0]); } catch(e:any) { if(e.code==='ER_DUP_ENTRY') return res.status(409).json({message:'CPF já cadastrado.'}); throw e; } }
export async function history(req: Request, res: Response) { const r=await query<any[]>('SELECT s.id,s.subtotal,s.discount_percent,s.discount_amount,s.total,s.status,s.created_at FROM sales s WHERE s.client_id=? ORDER BY s.created_at DESC',[req.params.id]); return res.json(r.rows); }
