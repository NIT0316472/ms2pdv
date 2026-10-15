import { Router } from "express";
import * as clientController from "../controllers/clientController";
import { auth } from "../middleware/auth";

const rorutes = Router();

rorutes.use(auth);
//************Rotas para cada cliente */
//Criar um novo cliente
rorutes.post("/", clientController.createClient);

/****Rotas para Listar Clientes */
//Listar todos os clientes
rorutes.get("/", clientController.listClients);
//Obter detalhes de um cliente específico
rorutes.get("/:id", clientController.getClient);
//Obter histórico de compras de um cliente específico
rorutes.get("/:id/history", clientController.history);

export default rorutes;
