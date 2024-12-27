"use strict";
// importa el modulo express para crear las rutas
import { Router } from "express";
// importa el controlador de instrumentos 
import instrumentoController from "../controllers/instrumento.controller.js";

// importa el middleware de autenticación
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

// importa el middleware de autorización
import { isAdmin } from "../middlewares/authorization.middleware.js";

// crea una instancia de Router
const router = Router();

// define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// define las rutas para los instrumentos
router.get("/", isAdmin, instrumentoController.getInstrumentos);
router.post("/", isAdmin, instrumentoController.createInstrumento);
router.get("/:id", isAdmin, instrumentoController.getInstrumento);
router.put("/:id", isAdmin, instrumentoController.updateInstrumento);
router.delete("/:id", isAdmin, instrumentoController.deleteInstrumento);
//ruta para asignar un instrumento a un usuario
router.patch("/:id/assign", isAdmin, instrumentoController.assignInstrumentToUser);
//ruta para desasignar un instrumento a un usuario
router.patch("/:id/unassign", isAdmin, instrumentoController.unassignInstrumentFromUser);

// exporta el enrutador
export default router;
