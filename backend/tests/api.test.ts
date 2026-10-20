process.env.JWT_SECRET = 'test-secret';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const db = vi.hoisted(() => ({
  query: vi.fn(),
  withTransaction: vi.fn(),
}));

vi.mock('../src/config/db', () => ({
  query: db.query,
  withTransaction: db.withTransaction,
}));

const { default: app } = await import('../src/server');

describe('MS² PDV API', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    db.query.mockReset();
    db.withTransaction.mockReset();
  });

  function token(role: 'CASHIER' | 'MANAGER' = 'CASHIER') {
    return jwt.sign(
      {
        id: role === 'MANAGER' ? 'mgr-1' : 'cashier-1',
        name: role === 'MANAGER' ? 'Gerente' : 'Caixa',
        email: role === 'MANAGER' ? 'gerente@ms2.local' : 'caixa@ms2.local',
        role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' },
    );
  }

  it('GET /health responde OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/auth/login autentica usuário e retorna token', async () => {
    const passwordHash = await bcrypt.hash('Caixa@123', 10);
    db.query.mockResolvedValue({
      rows: [
        {
          id: 'cashier-1',
          name: 'Caixa',
          email: 'caixa@ms2.local',
          password_hash: passwordHash,
          role: 'CASHIER',
        },
      ],
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'caixa@ms2.local', password: 'Caixa@123' });

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('CASHIER');
    expect(res.body.token).toBeTruthy();
  });

  it('GET /api/auth/me retorna o usuário autenticado', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token('CASHIER')}`);

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('CASHIER');
  });

  it('GET /api/clients/:id/history retorna histórico de compras', async () => {
    db.query.mockImplementation(async (sql: string, params?: any[]) => {
      if (sql.includes('FROM sales s WHERE s.client_id=?')) {
        return {
          rows: [
            {
              id: 'sale-1',
              client_id: params?.[0],
              subtotal: '100.00',
              discount_percent: 0,
              discount_amount: 0,
              total: '100.00',
              status: 'COMPLETED',
              created_at: '2026-10-20T00:00:00.000Z',
            },
          ],
        };
      }
      return { rows: [] };
    });

    const res = await request(app)
      .get('/api/clients/client-1/history')
      .set('Authorization', `Bearer ${token('CASHIER')}`);

    expect(res.status).toBe(200);
    expect(res.body[0].id).toBe('sale-1');
  });

  it('POST /api/clients cria cliente validado', async () => {
    db.query.mockImplementation(async (sql: string, params?: any[]) => {
      if (sql.includes('INSERT INTO clients')) {
        return { rows: [] };
      }
      if (sql.includes('SELECT id,name,cpf,phone,email,created_at FROM clients WHERE id=?')) {
        return {
          rows: [{
            id: params?.[0],
            name: 'Ana Souza',
            cpf: '12345678909',
            phone: '21999998888',
            email: 'ana@teste.com',
            created_at: '2026-10-20T00:00:00.000Z',
          }],
        };
      }
      return { rows: [] };
    });

    const res = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token('CASHIER')}`)
      .send({
        name: 'Ana Souza',
        cpf: '12345678909',
        phone: '21999998888',
        email: 'ana@teste.com',
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Ana Souza');
  });

  it('GET /api/products e POST/PUT listam e atualizam produtos', async () => {
    db.query.mockImplementation(async (sql: string) => {
      if (sql.includes('active=TRUE')) {
        return {
          rows: [
            { id: 'p-1', code: 'CAM-001', name: 'Camiseta', description: 'Algodão', price: '59.90', stock_quantity: 12 },
          ],
        };
      }
      if (sql.includes('INSERT INTO products')) {
        return { rows: [] };
      }
      if (sql.includes('UPDATE products SET')) {
        return { rows: { affectedRows: 1 } };
      }
      return { rows: [{ id: 'p-1', code: 'CAM-001', name: 'Camiseta', description: 'Algodão', price: '59.90', stock_quantity: 12 }] };
    });

    const list = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token('CASHIER')}`);
    expect(list.status).toBe(200);

    const create = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token('MANAGER')}`)
      .send({ code: 'CAM-002', name: 'Jaqueta', description: 'Teste', price: 199.9, stockQuantity: 5 });
    expect(create.status).toBe(201);

    const update = await request(app)
      .put('/api/products/p-1')
      .set('Authorization', `Bearer ${token('MANAGER')}`)
      .send({ name: 'Camiseta Atualizada', price: 69.9, stockQuantity: 15 });
    expect(update.status).toBe(200);
  });

  it('POST /api/sales cria venda com transação e reduz estoque', async () => {
    db.withTransaction.mockImplementation(async (fn: any) => {
      const client = {
        query: async (sql: string, params?: any[]) => {
          if (sql.includes('SELECT id FROM clients')) {
            return [[{ id: params?.[0] }]];
          }
          if (sql.includes('SELECT id,price,stock_quantity')) {
            return [[{ id: '22222222-2222-4222-8222-222222222222', price: '50.00', stock_quantity: 7, name: 'Produto A' }]];
          }
          if (sql.includes('INSERT INTO sales')) {
            return [{ insertId: 'sale-123' }];
          }
          if (sql.includes('INSERT INTO sale_items')) {
            return [{ insertId: 'item-123' }];
          }
          if (sql.includes('UPDATE products SET stock_quantity')) {
            return [{ affectedRows: 1 }];
          }
          if (sql.includes('SELECT * FROM sales WHERE id=?')) {
            return [[{ id: 'sale-123', total: '100.00', status: 'COMPLETED' }]];
          }
          return [[]];
        },
      };

      return fn(client);
    });

    const res = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${token('CASHIER')}`)
      .send({
        clientId: '11111111-1111-4111-8111-111111111111',
        items: [{ productId: '22222222-2222-4222-8222-222222222222', quantity: 2 }],
        discountPercent: 0,
      });

    expect(res.status).toBe(201);
    expect(res.body.sale.id).toBe('sale-123');
    expect(res.body.sale.total).toBe('100.00');
  });

  it('POST /api/sales/:id/cancel exige papel de gerente e cancela a venda', async () => {
    db.query.mockImplementation(async (sql: string) => {
      if (sql.includes("UPDATE sales")) {
        return { rows: { affectedRows: 1 } };
      }
      if (sql.includes('SELECT * FROM sales WHERE id = ?')) {
        return {
          rows: [{ id: 'sale-123', status: 'CANCELLED', cancelled_by: 'mgr-1' }],
        };
      }
      return { rows: [] };
    });

    const manager = await request(app)
      .post('/api/sales/sale-123/cancel')
      .set('Authorization', `Bearer ${token('MANAGER')}`);
    expect(manager.status).toBe(200);
    expect(manager.body.status).toBe('CANCELLED');

    const cashier = await request(app)
      .post('/api/sales/sale-123/cancel')
      .set('Authorization', `Bearer ${token('CASHIER')}`);
    expect(cashier.status).toBe(403);
  });

  it('GET /api/users e POST /api/users respeitam autorização por papel', async () => {
    db.query.mockImplementation(async (sql: string) => {
      if (sql.includes('SELECT id, name, email, role, created_at FROM users')) {
        return { rows: [{ id: 'u-1', name: 'Gerente', email: 'gerente@ms2.local', role: 'MANAGER', created_at: '2026-10-20' }] };
      }
      if (sql.includes('INSERT INTO users')) {
        return { rows: [] };
      }
      return { rows: [] };
    });

    const list = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token('MANAGER')}`);
    expect(list.status).toBe(200);

    const forbidden = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token('CASHIER')}`);
    expect(forbidden.status).toBe(403);
  });
});
