import mysql, { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { env } from "./env";

const url = new URL(env.databaseUrl);

export const pool = mysql.createPool({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: decodeURIComponent(url.pathname.replace(/^\//, "")),
  connectionLimit: 10,
  waitForConnections: true,
  decimalNumbers: true,
  multipleStatements: true,
});

export async function query<T = any>(sql: string, params: any[] = []) {
  const [rows] = await pool.query<any>(sql, params);
  return { rows: rows as T };
}

export async function withTransaction<T>(
  fn: (client: PoolConnection) => Promise<T>,
) {
  const client = await pool.getConnection();
  try {
    await client.beginTransaction();
    const result = await fn(client);
    await client.commit();
    return result;
  } catch (e) {
    await client.rollback();
    throw e;
  } finally {
    client.release();
  }
}
