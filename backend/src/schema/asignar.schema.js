"use strict";

import Joi from "joi";

const asignarBodySchema = Joi.object({
    instrumento: Joi.string()
        .required()
        .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
        .messages({
            "string.empty": "El id del instrumento no puede estar vacío.",
            "any.required": "El id del instrumento es obligatorio.",
            "string.base": "El id del instrumento debe ser de tipo string.",
            "string.pattern.base": "El id del instrumento proporcionado no es un ObjectId válido.",
        }),
    implemento: Joi.array().items(Joi.object({
        id: Joi.string()
            .required()
            .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
            .messages({
                "string.empty": "El id del implemento no puede estar vacío.",
                "any.required": "El id del implemento es obligatorio.",
                "string.base": "El id del implemento debe ser de tipo string.",
                "string.pattern.base": "El id del implemento proporcionado no es un ObjectId válido.",
            }),
        cantidad: Joi.number().required().messages({
            "number.base": "La cantidad debe ser de tipo number.",
            "any.required": "La cantidad es obligatoria.",
        }),
    })).messages({
        "array.base": "Los implementos deben ser de tipo array.",
        "any.required": "Los implementos son obligatorios.",
        "string.base": "Los implementos deben ser de tipo string.",
    }),
}).unknown(true);