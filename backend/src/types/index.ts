export type Role = 'CASHIER' | 'MANAGER';
export interface AuthUser { id: string; name: string; email: string; role: Role; }
