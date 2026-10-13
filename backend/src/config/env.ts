import 'dotenv/config';

const dbHost = process.env.DB_HOST ?? 'localhost';
const dbPort = Number(process.env.DB_PORT ?? 3307);
const dbUser = encodeURIComponent(process.env.DB_USER ?? 'root');
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD ?? 'alunolab');
const dbName = process.env.DB_NAME ?? 'ms2_pdv';

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  maxCashierDiscount: Number(process.env.MAX_CASHIER_DISCOUNT ?? 10),
  maxManagerDiscount: Number(process.env.MAX_MANAGER_DISCOUNT ?? 30)
};
