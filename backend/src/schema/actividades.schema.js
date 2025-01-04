// actividades.schema.js
import Joi from "joi";

const actividadesBodySchema = Joi.object({
  titulo: Joi.string()
    .when("$method", {
      is: Joi.valid("PATCH"),
      then: Joi.optional().messages({
          "string.base": "El título debe ser de tipo string."
      }),
      otherwise: Joi.string().required().messages({
        "string.empty": "El título no puede estar vacío.",
        "any.required": "El título es obligatorio.",
        "string.base": "El título debe ser de tipo string.",
      }),
    }),
  descripcion: Joi.string()
    .when("$method", {
      is: Joi.valid("PATCH"),
      then: Joi.optional().messages({
          "string.base": "La descripción debe ser de tipo string."
      }),
      otherwise: Joi.string().required().messages({
        "string.empty": "La descripción no puede estar vacía.",
        "any.required": "La descripción es obligatoria.",
        "string.base": "La descripción debe ser de tipo string.",
      }),
    }),
  fecha: Joi.date()
    .when("$method", {
      is: Joi.valid("PATCH"),
      then: Joi.optional().messages({
          "date.base": "La fecha debe ser de tipo date."
      }),
      otherwise: Joi.date().required().messages({
        "date.base": "La fecha debe ser de tipo date.",
        "any.required": "La fecha es obligatoria.",
      }),
    }),
  hora: Joi.string()
    .when("$method", {
      is: Joi.valid("PATCH"),
      then: Joi.optional().messages({
          "string.base": "La hora debe ser de tipo string."
      }),
      otherwise: Joi.string().required().messages({
        "string.empty": "La hora no puede estar vacía.",
        "any.required": "La hora es obligatoria.",
        "string.base": "La hora debe ser de tipo string.",
      }),
    }),
  lugar: Joi.string()
    .when("$method", {
      is: Joi.valid("PATCH"),
      then: Joi.optional().messages({
          "string.base": "El lugar debe ser de tipo string."
      }),
      otherwise: Joi.string().required().messages({
        "string.empty": "El lugar no puede estar vacío.",
        "any.required": "El lugar es obligatorio.",
        "string.base": "El lugar debe ser de tipo string.",
      }),
    }),
    participantes: Joi.array().items(Joi.object({
        integrante: Joi.string()
            .required()
            .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
            .messages({
                "string.empty": "El id del integrante no puede estar vacío.",
                "any.required": "El id del integrante es obligatorio.",
                "string.base": "El id del integrante debe ser de tipo string.",
                "string.pattern.base": "El id del integrante proporcionado no es un ObjectId válido.",
            }),
        estado: Joi.string().valid("pendiente", "confirmado", "no participa").default("pendiente"),
    })).messages({
        "array.base": "Los participantes deben ser de tipo array.",
        "any.required": "Los participantes son obligatorios.",
        "string.base": "Los participantes deben ser de tipo string.",
        "any.only": "El estado proporcionado no es válido.",
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

const confirmarParticipacionSchema = Joi.object({
    participacion: Joi.string().valid('confirmado', 'no participa').required().messages({
        "any.only": "El estado de participación proporcionado no es válido.",
        "any.required": "El estado de participación es obligatorio."
    }),
    justificacion: Joi.string().when('participacion', { is: 'no participa', then: Joi.string().required().messages({
        "string.empty": "La justificación no puede estar vacía cuando no participa.",
        "any.required": "La justificación es obligatoria cuando no participa.",
        "string.base": "La justificación debe ser de tipo string.",
    }), otherwise: Joi.string().optional() }),
}).unknown(true);


export { actividadesBodySchema, actividadesIdSchema, confirmarParticipacionSchema };