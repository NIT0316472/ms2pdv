import { randomUUID } from 'node:crypto';
import { query } from '../config/db';

export interface Sale {
  id: string;
  client_id: string;
  user_id: string;
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  total: number;
  status: 'COMPLETED' | 'CANCELLED';
  cancelled_by: string | null;
  created_at: string | Date;
  cancelled_at: string | Date | null;
  client_name?: string;
  user_name?: string;
}

export interface CreateSaleData {
  clientId: string;
  userId: string;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
}

export class SaleModel {
  static async findAll() {
    const result = await query<Sale[]>(
      `SELECT
         s.id,
         s.client_id,
         s.user_id,
         s.subtotal,
         s.discount_percent,
         s.discount_amount,
         s.total,
         s.status,
         s.cancelled_by,
         s.created_at,
         s.cancelled_at,
         c.name AS client_name,
         u.name AS user_name
       FROM sales s
       JOIN clients c ON c.id = s.client_id
       JOIN users u ON u.id = s.user_id
       ORDER BY s.created_at DESC
       LIMIT 100`
    );

    return result.rows;
  }

  static async findById(id: string) {
    const result = await query<Sale[]>(
      `SELECT
         s.id,
         s.client_id,
         s.user_id,
         s.subtotal,
         s.discount_percent,
         s.discount_amount,
         s.total,
         s.status,
         s.cancelled_by,
         s.created_at,
         s.cancelled_at,
         c.name AS client_name,
         u.name AS user_name
       FROM sales s
       JOIN clients c ON c.id = s.client_id
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ?`,
      [id]
    );

    return result.rows[0] ?? null;
  }

  static async create(data: CreateSaleData) {
    const id = randomUUID();

    await query(
      `INSERT INTO sales
       (id, client_id, user_id, subtotal, discount_percent, discount_amount, total)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.clientId,
        data.userId,
        data.subtotal,
        data.discountPercent,
        data.discountAmount,
        data.total
      ]
    );

    return this.findById(id);
  }

  static async cancel(id: string, userId: string) {
    const result = await query<any>(
      `UPDATE sales
       SET status = 'CANCELLED',
           cancelled_by = ?,
           cancelled_at = NOW()
       WHERE id = ?
         AND status = 'COMPLETED'`,
      [userId, id]
    );

    if (!result.rows?.affectedRows) {
      return null;
    }

    return this.findById(id);
  }
}