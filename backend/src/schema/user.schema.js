"use strict";

import Joi from "joi";
import ROLES from "../constants/roles.constants.js";

const userBodySchema = Joi.object({
  username: Joi.string()
    .when("$method", {
      is: Joi.valid("PATCH"),
      then: Joi.optional().messages({
        "string.base": "El nombre de usuario debe ser de tipo string.",
      }),
      otherwise: Joi.string().required().messages({
        "string.empty": "El nombre de usuario no puede estar vacío.",
        "any.required": "El nombre de usuario es obligatorio.",
        "string.base": "El nombre de usuario debe ser de tipo string.",
      }),
    }),
  rut: Joi.string()
    .when("$method", {
      is: Joi.valid("PATCH"),
      then: Joi.optional().messages({
          "string.base": "El rut debe ser de tipo string."
      }),
      otherwise: Joi.string().required().min(9).max(10)
      .pattern(/^[0-9]+[-|‐]{1}[0-9kK]{1}$/).messages({
        "string.empty": "El rut no puede estar vacío.",
        "any.required": "El rut es obligatorio.",
        "string.base": "El rut debe ser de tipo string.",
        "string.min": "El rut debe tener al menos 9 caracteres.",
        "string.max": "El rut debe tener al menos 10 caracteres.",
        "string.pattern.base": "El rut tiene el formato XXXXXXXX-X, ejemplo: 12345678-9.",
      }),
    }),
  fecha_nacimiento: Joi.date()
      .when("$method", {
        is: Joi.valid("PATCH"),
          then: Joi.optional().messages({
          "date.base": "La fecha de nacimiento debe ser de tipo date."
        }),
        otherwise: Joi.date().required().messages({
          "date.base": "La fecha de nacimiento debe ser de tipo date.",
          "any.required": "La fecha de nacimiento es obligatoria.",
        }),
      }),
  telefono: Joi.string()
  .when("$method", {
    is: Joi.valid("PATCH"),
      then: Joi.optional().messages({
      "string.base": "El teléfono debe ser de tipo string."
    }),
      otherwise: Joi.string().required().min(8).max(12).messages({
          "string.empty": "El teléfono no puede estar vacío.",
        "any.required": "El teléfono es obligatorio.",
        "string.base": "El teléfono debe ser de tipo string.",
        "string.min": "El teléfono debe tener al menos 8 caracteres.",
        "string.max": "El teléfono debe tener al menos 12 caracteres.",
      }),
  }),
  password: Joi.string()
    .when("$method", {
      is: Joi.valid("PATCH"),
      then: Joi.string().optional().min(5).messages({
        "string.base": "La contraseña debe ser de tipo string.",
        "string.min": "La contraseña debe tener al menos 5 caracteres.",
      }),
      otherwise: Joi.string().required().min(5).messages({
        "string.empty": "La contraseña no puede estar vacía.",
        "any.required": "La contraseña es obligatoria.",
        "string.base": "La contraseña debe ser de tipo string.",
        "string.min": "La contraseña debe tener al menos 5 caracteres.",
      }),
    }),
  email: Joi.string()
  .when("$method", {
    is: Joi.valid("PATCH"),
      then: Joi.optional().messages({
      "string.base": "El email debe ser de tipo string.",
      "string.email": "El email debe tener un formato válido.",
    }),
      otherwise: Joi.string().email().required().messages({
        "string.empty": "El email no puede estar vacío.",
        "any.required": "El email es obligatorio.",
        "string.base": "El email debe ser de tipo string.",
        "string.email": "El email debe tener un formato válido.",
      }),
  }),
  instrumento: Joi.string().optional().messages({
    "string.empty": "El instrumento no puede estar vacío.",
    "any.required": "El instrumento es obligatorio.",
    "string.base": "El instrumento debe ser de tipo string.",
    "any.only": "El instrumento proporcionado no es válido.",
  }),
    roles: Joi.array()
      .items(Joi.string().valid(...ROLES))
      .when("$method", {
        is: Joi.valid("PATCH"),
        then: Joi.array().items(Joi.string().valid(...ROLES)).optional().messages({
          "array.base": "El rol debe ser de tipo array.",
          "string.base": "El rol debe ser de tipo string.",
          "any.only": "El rol proporcionado no es válido.",
        }),
        otherwise: Joi.array()
          .items(Joi.string().valid(...ROLES))
          .required()
          .messages({
            "array.base": "El rol debe ser de tipo array.",
            "any.required": "El rol es obligatorio.",
            "string.base": "El rol debe ser de tipo string.",
            "any.only": "El rol proporcionado no es válido.",
          }),
    }),
  newPassword: Joi.string().min(5).messages({
    "string.empty": "La contraseña no puede estar vacía.",
    "string.base": "La contraseña debe ser de tipo string.",
    "string.min": "La contraseña debe tener al menos 5 caracteres.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});


const userIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id no puede estar vacío.",
      "any.required": "El id es obligatorio.",
      "string.base": "El id debe ser de tipo string.",
      "string.pattern.base": "El id proporcionado no es un ObjectId válido.",
    }),
});

export { userBodySchema, userIdSchema };