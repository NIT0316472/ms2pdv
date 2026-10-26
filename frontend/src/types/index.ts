export type Role = 'CASHIER' | 'MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  size?: string | null;
  color?: string | null;
  gender?: string | null;
  price: number;
  stock_quantity: number;
}

export interface Client {
  id: string;
  name: string;
  cpf: string;
  phone?: string;
  email?: string;
}

export interface Sale {
  id: string;
  client_id: string;
  user_id: string;
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  total: number;
  status: 'COMPLETED' | 'CANCELLED';
  created_at: string;
  cancelled_at?: string | null;
  client_name?: string;
  user_name?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  size?: string | null;
  color?: string | null;
  gender?: string | null;
  price: number;
  stock_quantity: number;
}

export interface Client {
  id: string;
  name: string;
  cpf: string;
  phone?: string;
  email?: string;
}

export interface Sale {
  id: string;
  client_id: string;
  user_id: string;
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  total: number;
  status: 'COMPLETED' | 'CANCELLED';
  created_at: string;
  cancelled_at?: string | null;
  client_name?: string;
  user_name?: string;
}

