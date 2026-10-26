import { Router } from "express";
import * as clientController from "../controllers/clientController";
import { auth, roles } from "../middleware/auth";

const rorutes = Router();

rorutes.use(auth);

rorutes.post("/", roles("MANAGER", "CASHIER"), clientController.createClient);
rorutes.get("/", roles("MANAGER", "CASHIER"), clientController.listClients);
rorutes.get("/:id", roles("MANAGER", "CASHIER"), clientController.getClient);
rorutes.get("/:id/history", roles("MANAGER", "CASHIER"), clientController.history);

export default rorutes;
