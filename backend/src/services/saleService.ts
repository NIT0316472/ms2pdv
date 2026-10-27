import { randomUUID } from 'node:crypto';
import { withTransaction } from '../config/db';
import { env } from '../config/env';
import { Role, PaymentMethod } from '../types';

export interface SaleInput {
  clientId: string;
  items: { productId: string; quantity: number }[];
  discountPercent: number;
  paymentMethod?: PaymentMethod;
  userId: string;
  role: Role;
}

export async function createSale(input: SaleInput) {
  const limit = input.role === 'MANAGER' ? env.maxManagerDiscount : env.maxCashierDiscount;
  if (input.discountPercent < 0 || input.discountPercent > limit) {
    throw Object.assign(new Error(`Desconto máximo para ${input.role === 'MANAGER' ? 'gerente' : 'caixa'} é ${limit}%.`), { status: 403 });
  }
  if (!input.items.length) {
    throw Object.assign(new Error('A venda precisa ter pelo menos um item.'), { status: 400 });
  }

  const paymentMethod: PaymentMethod = input.paymentMethod ?? 'PIX';
  const allowedMethods: PaymentMethod[] = ['PIX', 'DEBIT_CARD', 'CREDIT_CARD'];
  if (!allowedMethods.includes(paymentMethod)) {
    throw Object.assign(new Error('Forma de pagamento inválida. Permitido apenas PIX, DEBIT_CARD ou CREDIT_CARD.'), { status: 400 });
  }

  return withTransaction(async (client) => {
    const c = await client.query<any[]>('SELECT id FROM clients WHERE id=?', [input.clientId]);
    if (!c[0].length) {
      throw Object.assign(new Error('Cliente não encontrado.'), { status: 404 });
    }

    let subtotal = 0;
    const rows: any[] = [];
    for (const item of input.items) {
      const [r] = await client.query<any[]>(
        'SELECT id, price, stock_quantity, name FROM products WHERE id=? AND active=TRUE FOR UPDATE',
        [item.productId]
      );
      if (!r.length) {
        throw Object.assign(new Error('Produto não encontrado.'), { status: 404 });
      }
      const p = r[0];
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw Object.assign(new Error('Quantidade inválida.'), { status: 400 });
      }
      if (p.stock_quantity < item.quantity) {
        throw Object.assign(new Error(`Estoque insuficiente para ${p.name}.`), { status: 409 });
      }
      const sub = Number(p.price) * item.quantity;
      subtotal += sub;
      rows.push({
        productId: p.id,
        quantity: item.quantity,
        unitPrice: Number(p.price),
        subtotal: sub,
      });
    }

    const discountAmount = Number(((subtotal * input.discountPercent) / 100).toFixed(2));
    const total = Number((subtotal - discountAmount).toFixed(2));
    const saleId = randomUUID();

    await client.query(
      'INSERT INTO sales(id, client_id, user_id, subtotal, discount_percent, discount_amount, total, payment_method) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
      [saleId, input.clientId, input.userId, subtotal, input.discountPercent, discountAmount, total, paymentMethod]
    );

    for (const item of rows) {
      await client.query(
        'INSERT INTO sale_items(id, sale_id, product_id, quantity, unit_price, subtotal) VALUES(?, ?, ?, ?, ?, ?)',
        [randomUUID(), saleId, item.productId, item.quantity, item.unitPrice, item.subtotal]
      );
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    const [saleRows] = await client.query<any[]>('SELECT * FROM sales WHERE id=?', [saleId]);
    return { sale: saleRows[0], items: rows };
  });
}
