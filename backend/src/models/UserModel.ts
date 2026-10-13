import { randomUUID } from 'node:crypto';
import { query } from '../config/db';
import { Role } from '../types';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: string | Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password_hash: string;
  role: Role;
}

export class UserModel {
  static async findAll() {
    const result = await query<User[]>(
      `SELECT id, name, email, role, created_at
       FROM users
       ORDER BY name`
    );

    return result.rows;
  }

  static async findById(id: string) {
    const result = await query<User[]>(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE id = ?`,
      [id]
    );

    return result.rows[0] ?? null;
  }

  static async findByEmail(email: string) {
    const result = await query<User[]>(
      `SELECT *
       FROM users
       WHERE email = ?`,
      [email]
    );

    return result.rows[0] ?? null;
  }

  static async create(data: CreateUserData) {
    const id = randomUUID();

    await query(
      `INSERT INTO users
       (id, name, email, password_hash, role)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        data.name,
        data.email,
        data.password_hash,
        data.role
      ]
    );

    return this.findById(id);
  }
}