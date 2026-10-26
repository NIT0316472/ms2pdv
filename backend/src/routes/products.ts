import { Router } from 'express';
import * as p from '../controllers/productController';
import { auth, roles } from '../middleware/auth';

const r = Router();

r.use(auth);
r.get('/generate-code', roles('MANAGER', 'CASHIER'), p.getGeneratedCode);
r.get('/', roles('MANAGER', 'CASHIER'), p.listProducts);
r.get('/:id', roles('MANAGER', 'CASHIER'), p.getProduct);
r.post('/', roles('MANAGER', 'CASHIER'), p.createProduct);
r.put('/:id', roles('MANAGER'), p.updateProduct);
r.delete('/:id', roles('MANAGER'), p.deleteProduct);

export default r;
