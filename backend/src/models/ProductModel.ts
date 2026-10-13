import { randomUUID } from 'node:crypto';
import { query } from '../config/db';

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  active: boolean | number;
  created_at: string | Date;
}

export interface CreateProductData {
  code: string;
  name: string;
  description?: string | null;
  price: number;
  stockQuantity: number;
}

export interface UpdateProductData {
  code?: string;
  name?: string;
  description?: string | null;
  price?: number;
  stockQuantity?: number;
  active?: boolean;
}

export class ProductModel {
  static async findAll(search?: string) {
    let sql = `
      SELECT *
      FROM products
      WHERE active = TRUE
    `;

    const params: any[] = [];

    if (search) {
      sql += `
        AND (
          code LIKE ?
          OR name LIKE ?
          OR description LIKE ?
        )
      `;

      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY name`;

    const result = await query<Product[]>(sql, params);
    return result.rows;
  }

  static async findById(id: string) {
    const result = await query<Product[]>(
      `SELECT *
       FROM products
       WHERE id = ?`,
      [id]
    );

    return result.rows[0] ?? null;
  }

  static async create(data: CreateProductData) {
    const id = randomUUID();

    await query(
      `INSERT INTO products
       (id, code, name, description, price, stock_quantity)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.code,
        data.name,
        data.description ?? null,
        data.price,
        data.stockQuantity
      ]
    );

    return this.findById(id);
  }

  static async update(id: string, data: UpdateProductData) {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.code !== undefined) {
      fields.push('code = ?');
      values.push(data.code);
    }

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }

    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }

    if (data.price !== undefined) {
      fields.push('price = ?');
      values.push(data.price);
    }

    if (data.stockQuantity !== undefined) {
      fields.push('stock_quantity = ?');
      values.push(data.stockQuantity);
    }

    if (data.active !== undefined) {
      fields.push('active = ?');
      values.push(data.active ? 1 : 0);
    }

    if (!fields.length) {
      return this.findById(id);
    }

    values.push(id);

    await query(
      `UPDATE products
       SET ${fields.join(', ')}
       WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async decreaseStock(id: string, quantity: number) {
    const result = await query<any>(
      `UPDATE products
       SET stock_quantity = stock_quantity - ?
       WHERE id = ?
         AND stock_quantity >= ?`,
      [quantity, id, quantity]
    );

    if (!result.rows?.affectedRows) {
      return null;
    }

    return this.findById(id);
  }

  static async increaseStock(id: string, quantity: number) {
    const result = await query<any>(
      `UPDATE products
       SET stock_quantity = stock_quantity + ?
       WHERE id = ?`,
      [quantity, id]
    );

    if (!result.rows?.affectedRows) {
      return null;
    }

    return this.findById(id);
  }
}