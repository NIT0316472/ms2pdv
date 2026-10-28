import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { query } from "../config/db";
import { generateRandomCode } from "../utils/codeGenerator";

export function generateProductCode(): string {
  // Gera código no formato exato: 3 letras e 3 números com hífen (ex: CAM-001, ABC-123)
  return generateRandomCode(3, 3);
}

export async function getGeneratedCode(_req: Request, res: Response) {
  let code = generateProductCode();
  let attempts = 0;

  while (attempts < 20) {
    const exists = await query<any[]>("SELECT id FROM products WHERE code = ?", [code]);
    if (!exists.rows.length) break;
    code = generateProductCode();
    attempts += 1;
  }

  return res.json({ code });
}

const schema = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  size: z.string().optional().or(z.literal('')),
  color: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  price: z.number().nonnegative(),
  stockQuantity: z.number().int().nonnegative(),
});
export async function listProducts(req: Request, res: Response) {
  const term = String(req.query.search ?? "").trim();
  const r = term
    ? await query<any[]>(
        "SELECT * FROM products WHERE active=TRUE AND (code LIKE ? OR name LIKE ? OR description LIKE ?) ORDER BY name",
        [`%${term}%`, `%${term}%`, `%${term}%`],
      )
    : await query<any[]>(
        "SELECT * FROM products WHERE active=TRUE ORDER BY name",
      );
  return res.json(r.rows);
}
export async function getProduct(req: Request, res: Response) {
  const r = await query<any[]>("SELECT * FROM products WHERE id=?", [
    req.params.id,
  ]);
  if (!r.rows.length)
    return res.status(404).json({ message: "Produto não encontrado." });
  return res.json(r.rows[0]);
}
export async function createProduct(req: Request, res: Response) {
  const p = schema.safeParse(req.body);
  if (!p.success)
    return res.status(400).json({ message: p.error.issues[0].message });

  try {
    let code = p.data.code?.trim() || generateProductCode();
    let attempts = 0;

    while (attempts < 10) {
      const exists = await query<any[]>("SELECT id FROM products WHERE code = ?", [code]);
      if (!exists.rows.length) break;
      code = generateProductCode();
      attempts += 1;
    }

    const id = randomUUID();
    await query(
      "INSERT INTO products(id,code,name,description,size,color,gender,price,stock_quantity) VALUES(?,?,?,?,?,?,?,?,?)",
      [
        id,
        code,
        p.data.name,
        p.data.description ?? null,
        p.data.size || null,
        p.data.color || null,
        p.data.gender || null,
        p.data.price,
        p.data.stockQuantity,
      ],
    );
    const r = await query<any[]>("SELECT * FROM products WHERE id=?", [id]);
    return res.status(201).json(r.rows[0]);
  } catch (e: any) {
    if (e.code === "ER_DUP_ENTRY")
      return res
        .status(409)
        .json({ message: "Código de produto já cadastrado." });
    throw e;
  }
}
export async function updateProduct(req: Request, res: Response) {
  const p = schema.partial().safeParse(req.body);
  if (!p.success) return res.status(400).json({ message: "Dados inválidos." });
  const fields: any[] = [];
  const values: any[] = [];
  for (const [k, v] of Object.entries(p.data)) {
    if (v === "") continue;
    const dbk = k === "stockQuantity" ? "stock_quantity" : k;
    fields.push(`${dbk}=?`);
    values.push(v);
  }
  if (!fields.length)
    return res.status(400).json({ message: "Nenhum campo enviado." });
  values.push(req.params.id);
  const r = await query<any>(
    "UPDATE products SET " + fields.join(",") + " WHERE id=?",
    values,
  );
  if (!r.rows.affectedRows)
    return res.status(404).json({ message: "Produto não encontrado." });
  const out = await query<any[]>("SELECT * FROM products WHERE id=?", [
    req.params.id,
  ]);
  return res.json(out.rows[0]);
}

export async function deleteProduct(req: Request, res: Response) {
  const relatedSales = await query<any[]>("SELECT id FROM sale_items WHERE product_id=?", [
    req.params.id,
  ]);

  if (relatedSales.rows.length) {
    return res.status(409).json({
      message: "Não é possível excluir produto com histórico de vendas.",
    });
  }

  try {
    const result = await query<any>("DELETE FROM products WHERE id=?", [
      req.params.id,
    ]);

    if (!result.rows.affectedRows) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    return res.json({ message: "Produto removido com sucesso." });
  } catch (error: any) {
    if (error?.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message: "Não é possível excluir produto com histórico de vendas.",
      });
    }

    throw error;
  }
}
