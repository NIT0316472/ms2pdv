import { randomUUID } from 'node:crypto';
import { query } from '../config/db';

export interface Client {
  id: string;
  name: string;
  cpf: string;
  phone: string | null;
  email: string | null;
  created_at: string | Date;
}

export interface CreateClientData {
  name: string;
  cpf: string;
  phone?: string | null;
  email?: string | null;
}

export class ClientModel {
  static async findAll() {
    const result = await query<Client[]>(
      `SELECT id, name, cpf, phone, email, created_at
       FROM clients
       ORDER BY name`
    );

    return result.rows;
  }

  static async findById(id: string) {
    const result = await query<Client[]>(
      `SELECT id, name, cpf, phone, email, created_at
       FROM clients
       WHERE id = ?`,
      [id]
    );

    return result.rows[0] ?? null;
  }

  static async findByCpf(cpf: string) {
    const result = await query<Client[]>(
      `SELECT id, name, cpf, phone, email, created_at
       FROM clients
       WHERE cpf = ?`,
      [cpf]
    );

    return result.rows[0] ?? null;
  }

  static async create(data: CreateClientData) {
    const id = randomUUID();

    await query(
      `INSERT INTO clients
       (id, name, cpf, phone, email)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        data.name,
        data.cpf,
        data.phone ?? null,
        data.email ?? null
      ]
    );

    return this.findById(id);
  }

  static async getHistory(id: string) {
    const result = await query<any[]>(
      `SELECT
         s.id,
         s.subtotal,
         s.discount_percent,
         s.discount_amount,
         s.total,
         s.status,
         s.created_at
       FROM sales s
       WHERE s.client_id = ?
       ORDER BY s.created_at DESC`,
      [id]
    );

    return result.rows;
  }
}