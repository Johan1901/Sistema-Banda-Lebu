"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import InstrumentoService from "../services/instrumento.service.js";
import {
  instrumentoBodySchema,
  instrumentoIdSchema,
} from "../schema/instrumento.schema.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los instrumentos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getInstrumentos(req, res) {
  try {
    const [instrumentos, error] = await InstrumentoService.getInstrumentos();
    if (error) return respondError(req, res, 404, error);

    instrumentos.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, instrumentos);
  } catch (error) {
    handleError(error, "instrumento.controller -> getInstrumentos");
    respondError(req, res, 500, "No se pudo obtener los instrumentos");
  }
}

/**
 * Crea un nuevo instrumento
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function createInstrumento(req, res) {
  try {
    const { body } = req;
    const { error: bodyError } = instrumentoBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [newInstrumento, error] = await InstrumentoService.createInstrumento(
      body
    );

    if (error) return respondError(req, res, 400, error);

    respondSuccess(req, res, 201, newInstrumento);
  } catch (error) {
    handleError(error, "instrumento.controller -> createInstrumento");
    respondError(req, res, 500, "No se pudo crear el instrumento");
  }
}

/**
 * Obtiene un instrumento por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function getInstrumento(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = instrumentoIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [instrumento, error] = await InstrumentoService.getInstrumento(
      params.id
    );
    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 200, instrumento);
  } catch (error) {
    handleError(error, "instrumento.controller -> getInstrumento");
    respondError(req, res, 500, "No se pudo obtener el instrumento");
  }
}

/**
 * Actualiza un instrumento por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function updateInstrumento(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = instrumentoIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { error: bodyError } = instrumentoBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [updatedInstrumento, error] =
      await InstrumentoService.updateInstrumento(params.id, body);
    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 200, updatedInstrumento);
  } catch (error) {
    handleError(error, "instrumento.controller -> updateInstrumento");
    respondError(req, res, 500, "No se pudo actualizar el instrumento");
  }
}

/**
 * Elimina un instrumento por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function deleteInstrumento(req, res) {
  try {
    const { params } = req;
    const { error: paramsError } = instrumentoIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const [deletedInstrumento, error] =
      await InstrumentoService.deleteInstrumento(params.id);
    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 204, deletedInstrumento);
  } catch (error) {
    handleError(error, "instrumento.controller -> deleteInstrumento");
    respondError(req, res, 500, "No se pudo eliminar el instrumento");
  }
}

/**
 * Asigna un instrumento a un usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function assignInstrumentToUser(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = instrumentoIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { asignadoA: userId } = body;
    if (!userId) return respondError(req, res, 400, "El id del usuario es obligatorio");

    const [assignedInstrument, error] = await InstrumentoService.assignInstrumentToUser(
      params.id,
      userId
    );
    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 200, assignedInstrument);
  } catch (error) {
    handleError(error, "instrumento.controller -> assignInstrumentToUser");
    respondError(req, res, 500, "No se pudo asignar el instrumento al usuario");
  }
}

/**
 * Desasigna un instrumento de un usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function unassignInstrumentFromUser(req, res) {
  try {
    const { params, body } = req;
    const { error: paramsError } = instrumentoIdSchema.validate(params);
    if (paramsError) return respondError(req, res, 400, paramsError.message);

    const { asignadoA: userId } = body;
    if (!userId) return respondError(req, res, 400, "El id del usuario es obligatorio");

    const [unassignedInstrument, error] =
      await InstrumentoService.unassignInstrumentToUser(params.id, userId);
    if (error) return respondError(req, res, 404, error);

    respondSuccess(req, res, 200, unassignedInstrument);
  } catch (error) {
    handleError(error, "instrumento.controller -> unassignInstrumentFromUser");
    respondError(req, res, 500, "No se pudo desasignar el instrumento al usuario");
  }
}

export default {
  getInstrumentos,
  createInstrumento,
  getInstrumento,
  updateInstrumento,
  deleteInstrumento,
  assignInstrumentToUser,
  unassignInstrumentFromUser,
};