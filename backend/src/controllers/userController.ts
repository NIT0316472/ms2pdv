import { Request, Response } from 'express';
export function currentUser(req: Request,res: Response){return res.json({user:req.user});}
