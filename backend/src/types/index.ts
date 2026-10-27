export type Role = 'CASHIER' | 'MANAGER';
export type PaymentMethod = 'PIX' | 'DEBIT_CARD' | 'CREDIT_CARD';
export interface AuthUser { id: string; name: string; email: string; role: Role; }
