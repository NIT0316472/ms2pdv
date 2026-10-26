import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { pool } from "./db";

async function main() {
  const manager = await bcrypt.hash("Gerente@123", 10);
  const cashier = await bcrypt.hash("Caixa@123", 10);

  const [users] = await pool.query<any[]>(
    "SELECT email, name FROM users WHERE email IN (?, ?, ?, ?)",
    [
      "gerente@singularidade.local",
      "caixa@singularidade.local",
      "gerente@ms2.local",
      "caixa@ms2.local",
    ],
  );
  const userMap = new Map(users.map((u: any) => [u.email, u]));

  const defaultUsers = [
    { email: "gerente@singularidade.local", name: "Gerente Singularidade", password: manager, role: "MANAGER" },
    { email: "caixa@singularidade.local", name: "Caixa Singularidade", password: cashier, role: "CASHIER" },
    { email: "gerente@ms2.local", name: "Gerente Singularidade", password: manager, role: "MANAGER" },
    { email: "caixa@ms2.local", name: "Caixa Singularidade", password: cashier, role: "CASHIER" },
  ];

  for (const user of defaultUsers) {
    const existing = userMap.get(user.email);
    if (!existing) {
      await pool.query(
        "INSERT INTO users(id,name,email,password_hash,role) VALUES (?,?,?,?,?)",
        [randomUUID(), user.name, user.email, user.password, user.role],
      );
      continue;
    }

    if (existing.name !== user.name) {
      await pool.query(
        "UPDATE users SET name = ? WHERE email = ?",
        [user.name, user.email],
      );
    }
  }

  const [products] = await pool.query<any[]>(
    "SELECT code FROM products WHERE code IN (?,?,?)",
    ["CAM-001", "CAL-001", "BON-001"],
  );
  const codes = new Set(products.map((p: any) => p.code));
  const seedProducts = [
    ["CAM-001", "Camiseta Básica", "Camiseta de algodão", "M", "Preto", "UNISSEX", 59.9, 30],
    ["CAL-001", "Calça Jeans", "Calça jeans tradicional", "40", "Azul", "MASCULINO", 149.9, 15],
    ["BON-001", "Boné Singularidade", "Boné oficial da marca Singularidade", "Único", "Cinza", "UNISSEX", 39.9, 20],
  ];
  for (const p of seedProducts)
    if (!codes.has(p[0]))
      await pool.query(
        "INSERT INTO products(id,code,name,description,size,color,gender,price,stock_quantity) VALUES (?,?,?,?,?,?,?,?,?)",
        [randomUUID(), p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]],
      );

  await pool.end();
  console.log("Seed MySQL concluído para o projeto Singularidade.");
}
main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
