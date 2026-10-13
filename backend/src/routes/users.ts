import { Router } from 'express';
import { auth, roles } from '../middleware/auth';
import { currentUser, createUser, getUser, listUsers } from '../controllers/userController';

const r = Router();

r.get('/me', auth, currentUser);
r.get('/', auth, roles('MANAGER'), listUsers);
r.get('/:id', auth, roles('MANAGER'), getUser);
r.post('/', auth, roles('MANAGER'), createUser);

export default r;
