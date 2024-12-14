"use strict";

import Joi from "joi";
import MARCA from "../constants/marca.constants.js";
import ESTADO from "../constants/estado.constants.js";
import IMPLEMENTOS from "../constants/implementos.constants.js";


const instrumentoBodySchema = Joi.object({
    nombre: Joi.string().required().messages({
        "string.empty": "El nombre no puede estar vacío.",
        "any.required": "El nombre es obligatorio.",
        "string.base": "El nombre debe ser de tipo string.",
    }),
    marca: Joi.string().valid(...MARCA).required().messages({
        "string.empty": "La marca no puede estar vacía.",
        "any.required": "La marca es obligatoria.",
        "string.base": "La marca debe ser de tipo string.",
    }),
    estado: Joi.string().valid(...ESTADO).required().messages({
        "string.empty": "El estado no puede estar vacío.",
        "any.required": "El estado es obligatorio.",
        "string.base": "El estado debe ser de tipo string.",
    }),
    implemento: Joi.string().valid(...IMPLEMENTOS).required().messages({
        "string.empty": "El implemento no puede estar vacío.",
        "any.required": "El implemento es obligatorio.",
        "string.base": "El implemento debe ser de tipo string.",
    }),
}).unknown(true);

const instrumentoIdSchema = Joi.object({
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

export { instrumentoBodySchema, instrumentoIdSchema };