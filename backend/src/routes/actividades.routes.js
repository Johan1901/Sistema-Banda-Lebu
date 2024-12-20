"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";
// Importa el controlador de actividades
import actividadesController from "../controllers/actividades.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isAdmin, isUser } from "../middlewares/authorization.middleware.js";


const router = Router();

router.use(authenticationMiddleware);

router.get("/", actividadesController.getActividades);
router.post("/", isAdmin, actividadesController.createActividades);
router.get("/:id", isAdmin, actividadesController.getActividad);
router.put("/:id", isAdmin, actividadesController.updateActividades);
router.delete("/:id", isAdmin, actividadesController.deleteActividades);
//ruta para confirmar la participacion de un usuario en una actividad
router.patch("/:id/confirmarParticipacion/:participanteId", isUser, actividadesController.confirmarParticipacion);
//ruta para confirmar la participacion de los usuarios como administrador
router.patch("/:id/confirmarParticipacionesAdmin/:participanteId", isAdmin, actividadesController.confirmarParticipacionesAdmin);

export default router;
