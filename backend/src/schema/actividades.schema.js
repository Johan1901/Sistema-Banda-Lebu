"use strict";

import Joi from "joi";

const actividadesBodySchema = Joi.object({
    titulo: Joi.string().required().messages({
        "string.empty": "El título no puede estar vacío.",
        "any.required": "El título es obligatorio.",
        "string.base": "El título debe ser de tipo string.",
    }),
    descripcion: Joi.string().required().messages({
        "string.empty": "La descripción no puede estar vacía.",
        "any.required": "La descripción es obligatoria.",
        "string.base": "La descripción debe ser de tipo string.",
    }),
    fecha: Joi.date().required().messages({
        "date.base": "La fecha debe ser de tipo date.",
        "any.required": "La fecha es obligatoria.",
    }),
    hora: Joi.string().required().messages({
        "string.empty": "La hora no puede estar vacía.",
        "any.required": "La hora es obligatoria.",
        "string.base": "La hora debe ser de tipo string.",
    }),
    lugar: Joi.string().required().messages({
        "string.empty": "El lugar no puede estar vacío.",
        "any.required": "El lugar es obligatorio.",
        "string.base": "El lugar debe ser de tipo string.",
    }),
    participantes: Joi.array().items(Joi.string()).messages({
        "array.base": "El participante debe ser de tipo array.",
        "any.required": "El participante es obligatorio.",
        "string.base": "El participante debe ser de tipo string.",
    }),
}).unknown(true);

const actividadesIdSchema = Joi.object({
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

export { actividadesBodySchema, actividadesIdSchema };