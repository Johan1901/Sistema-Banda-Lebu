"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Enrutador de usuarios  */
import userRoutes from "./user.routes.js";

/** Enrutador de autenticación */
import authRoutes from "./auth.routes.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

// importa rutas de instrumento
import instrumentoRoutes from "./instrumento.routes.js";

// importa rutas de implemento
import implementoRoutes from "./implemento.routes.js";

/** Instancia del enrutador */
const router = Router();

// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware, userRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);

// Define las rutas para los instrumentos /api/instrumentos
router.use("/instrumentos", authenticationMiddleware, instrumentoRoutes);

// define las rutas para los implementos /api/implementos
router.use("/implementos", authenticationMiddleware, implementoRoutes);
// Exporta el enrutador
export default router;
