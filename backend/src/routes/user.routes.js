"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de usuarios */
import usuarioController from "../controllers/user.controller.js";

/** Middlewares de autorización */
import { isAdmin } from "../middlewares/authorization.middleware.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);
// Define las rutas para los usuarios
router.get("/", usuarioController.getUsers);
router.post("/", isAdmin, usuarioController.createUser);
router.get("/:id", usuarioController.getUserById);
router.patch("/:id", isAdmin, usuarioController.updateUser);
router.delete("/:id", isAdmin, usuarioController.deleteUser);
//ruta para obtener a usuario por su email
router.get("/email/:email", usuarioController.getUserByEmail);

// Exporta el enrutador
export default router;
