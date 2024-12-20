"use strict";

import Joi from "joi";
import INSTRUMENTOS from "../constants/instrumentos.constants.js";

const inventarioBodySchema = Joi.object({
    instrumento: Joi.string().valid(...INSTRUMENTOS).required().messages({
        "string.empty": "El instrumento no puede estar vacío.",
        "any.required": "El instrumento es obligatorio.",
        "string.base": "El instrumento debe ser de tipo string.",
    }),
    stock: Joi.number().integer().min(0).max(99).required().messages({   
        "number.empty": "La stock no puede estar vacía.",
        "any.required": "La stock es obligatoria.",
        "number.base": "La stock debe ser de tipo number.",
        "number.min": "La stock debe ser mayor a 0.",
        "number.max": "La stock debe ser menor a 100."
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

const inventarioIdSchema = Joi.object({
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

export { inventarioBodySchema, inventarioIdSchema };