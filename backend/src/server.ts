import express from 'express'; import cors from 'cors'; import { env } from './config/env';
import auth from './routes/auth'; import clients from './routes/clients'; import products from './routes/products'; import sales from './routes/sales'; import users from './routes/users';
const app=express(); app.use(cors({origin:env.corsOrigin})); app.use(express.json());

// Root route to help browsers hitting http://localhost:3000/
app.get('/', (_req, res) => res.redirect('/health'));

app.get('/health',(_,res)=>res.json({status:'ok',project:'MS² Vestuário PDV'}));
app.use('/api/auth',auth); app.use('/api/clients',clients); app.use('/api/products',products); app.use('/api/sales',sales); app.use('/api/users',users);
app.use((err:any,_req:any,res:any,_next:any)=>{console.error(err);res.status(500).json({message:'Erro interno do servidor.'});});
if(require.main===module) app.listen(env.port,()=>console.log(`API em http://localhost:${env.port}`));
export default app;
