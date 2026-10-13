import { randomUUID } from 'node:crypto';
import { query } from '../config/db';

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product_code?: string;
  product_name?: string;
}

export interface CreateSaleItemData {
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export class SaleItemModel {
  static async findById(id: string) {
    const result = await query<SaleItem[]>(
      `SELECT
         si.id,
         si.sale_id,
         si.product_id,
         si.quantity,
         si.unit_price,
         si.subtotal,
         p.code AS product_code,
         p.name AS product_name
       FROM sale_items si
       JOIN products p ON p.id = si.product_id
       WHERE si.id = ?`,
      [id]
    );

    return result.rows[0] ?? null;
  }

  static async findBySaleId(saleId: string) {
    const result = await query<SaleItem[]>(
      `SELECT
         si.id,
         si.sale_id,
         si.product_id,
         si.quantity,
         si.unit_price,
         si.subtotal,
         p.code AS product_code,
         p.name AS product_name
       FROM sale_items si
       JOIN products p ON p.id = si.product_id
       WHERE si.sale_id = ?
       ORDER BY si.id`,
      [saleId]
    );

    return result.rows;
  }

  static async create(data: CreateSaleItemData) {
    const id = randomUUID();

    await query(
      `INSERT INTO sale_items
       (id, sale_id, product_id, quantity, unit_price, subtotal)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.saleId,
        data.productId,
        data.quantity,
        data.unitPrice,
        data.subtotal
      ]
    );

    return this.findById(id);
  }
}