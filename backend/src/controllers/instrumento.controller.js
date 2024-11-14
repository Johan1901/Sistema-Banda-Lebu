"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import InstrumentoService from "../services/instrumento.service.js";
import { instrumentoBodySchema, instrumentoIdSchema } from "../schema/instrumento.schema.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los instrumentos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getInstrumentos(req, res) {
    try {
        const [instrumentos, errorInstrumentos] = await InstrumentoService.getInstrumentos();
        if (errorInstrumentos) return respondError(req, res, 404, errorInstrumentos);
    
        instrumentos.length === 0
        ? respondSuccess(req, res, 204)
        : respondSuccess(req, res, 200, instrumentos);
    } catch (error) {
        handleError(error, "instrumento.controller -> getInstrumentos");
        respondError(req, res, 400, error.message);
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
    
        const [newInstrumento, instrumentoError] = await InstrumentoService.createInstrumento(body);
    
        if (instrumentoError) return respondError(req, res, 400, instrumentoError);
        if (!newInstrumento) {
            return respondError(req, res, 400, "No se creo el instrumento");
        }
    
        respondSuccess(req, res, 201, newInstrumento);
    } catch (error) {
        handleError(error, "instrumento.controller -> createInstrumento");
        respondError(req, res, 500, "No se creo el instrumento");
    }
}

/**
 * Obtiene un instrumento por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getInstrumentoById(req, res) {
    try {
        const { params } = req;
        const { error: paramsError } = instrumentoIdSchema.validate(params);
        if (paramsError) return respondError(req, res, 400, paramsError.message);
    
        const [instrumento, errorInstrumento] = await InstrumentoService.getInstrumentoById(params.id);
        if (errorInstrumento) return respondError(req, res, 404, errorInstrumento);
    
        respondSuccess(req, res, 200, instrumento);
    } catch (error) {
        handleError(error, "instrumento.controller -> getInstrumentoById");
        respondError(req, res, 400, error.message);
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
    
        const [updatedInstrumento, errorInstrumento] = await InstrumentoService.updateInstrumento(params.id, body);
        if (errorInstrumento) return respondError(req, res, 404, errorInstrumento);
    
        respondSuccess(req, res, 200, updatedInstrumento);
    } catch (error) {
        handleError(error, "instrumento.controller -> updateInstrumento");
        respondError(req, res, 400, error.message);
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
    
        const [deletedInstrumento, errorInstrumento] = await InstrumentoService.deleteInstrumento(params.id);
        if (errorInstrumento) return respondError(req, res, 404, errorInstrumento);
    
        respondSuccess(req, res, 200, deletedInstrumento);
    } catch (error) {
        handleError(error, "instrumento.controller -> deleteInstrumento");
        respondError(req, res, 400, error.message);
    }

}

export default {
    getInstrumentos,
    createInstrumento,
    getInstrumentoById,
    updateInstrumento,
    deleteInstrumento
}

