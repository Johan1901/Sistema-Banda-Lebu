"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";
// Importa el controlador de actividades
import actividadesController from "../controllers/actividades.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isAdmin, actividadesController.getActividades);
router.post("/", isAdmin, actividadesController.createActividades);
router.get("/:id", isAdmin, actividadesController.getActividad);
router.put("/:id", isAdmin, actividadesController.updateActividades);
router.delete("/:id", isAdmin, actividadesController.deleteActividades);
//ruta para añadir a todos los participantes a una actividad
//router.put("/:id/participantes", isAdmin, actividadesController.addParticipantes);
//ruta para eliminar a un participante de una actividad
//router.delete("/:id/participantes", isAdmin, actividadesController.deleteParticipante);
export default router;
