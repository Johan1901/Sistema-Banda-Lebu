"use strict";

// importa el modulo express para crear las rutas
import { Router } from "express";
// importa el controlador de implementos
import implementoController from "../controllers/implemento.controller.js";

// importa el middleware de autenticación
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

// importa el middleware de autorización
import { isAdmin } from "../middlewares/authorization.middleware.js";

// crea una instancia de Router
const router = Router();

// define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// define las rutas para los implementos
router.get("/", isAdmin, implementoController.getImplementos);
router.post("/", isAdmin, implementoController.createImplemento);
router.get("/:id", isAdmin, implementoController.getImplemento);
router.put("/:id", isAdmin, implementoController.updateImplemento);
router.delete("/:id", isAdmin, implementoController.deleteImplemento);

// exporta el enrutador
export default router;