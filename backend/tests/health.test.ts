import { describe,it,expect } from 'vitest'; import request from 'supertest'; import app from '../src/server';
describe('API',()=>{it('health responde',async()=>{const r=await request(app).get('/health');expect(r.status).toBe(200);expect(r.body.status).toBe('ok');});});
