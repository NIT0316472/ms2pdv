import { Request, Response } from "express";
import { z } from "zod";
import { query } from "../config/db";
import { createSale } from "../services/saleService";
const schema = z.object({
  clientId: z.string().uuid(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  discountPercent: z.number().min(0),
});
export async function create(req: Request, res: Response) {
  const p = schema.safeParse(req.body);
  if (!p.success)
    return res.status(400).json({ message: p.error.issues[0].message });
  try {
    return res
      .status(201)
      .json(
        await createSale({
          ...p.data,
          userId: req.user!.id,
          role: req.user!.role,
        }),
      );
  } catch (e: any) {
    return res
      .status(e.status ?? 500)
      .json({ message: e.message ?? "Erro interno." });
  }
}
export async function list(req: Request, res: Response) {
  const r = await query<any[]>(
    "SELECT s.*,c.name client_name,u.name user_name FROM sales s JOIN clients c ON c.id=s.client_id JOIN users u ON u.id=s.user_id ORDER BY s.created_at DESC LIMIT 100",
  );
  return res.json(r.rows);
}
export async function get(req: Request, res: Response) {
  const s = await query<any[]>(
    "SELECT s.*,c.name client_name,u.name user_name FROM sales s JOIN clients c ON c.id=s.client_id JOIN users u ON u.id=s.user_id WHERE s.id=?",
    [req.params.id],
  );
  if (!s.rows.length)
    return res.status(404).json({ message: "Venda não encontrada." });
  const items = await query<any[]>(
    "SELECT si.*,p.code,p.name FROM sale_items si JOIN products p ON p.id=si.product_id WHERE si.sale_id=?",
    [req.params.id],
  );
  return res.json({ sale: s.rows[0], items: items.rows });
}
export async function cancel(req: Request, res: Response) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await createCancellation(id, req.user!.id);
  if (!result)
    return res
      .status(404)
      .json({ message: "Venda não encontrada ou já cancelada." });
  return res.json(result);
}

async function createCancellation(id: string, userId: string) {
  const result = await query<any>(
    `UPDATE sales
     SET status = 'CANCELLED',
         cancelled_by = ?,
         cancelled_at = NOW()
     WHERE id = ?
       AND status = 'COMPLETED'`,
    [userId, id],
  );

  if (!result.rows?.affectedRows) return null;

  const out = await query<any[]>(`SELECT * FROM sales WHERE id = ?`, [id]);
  return out.rows[0] ?? null;
}
