"use strict";

//import Implemento from "../models/implemento.model.js";
import { handleError } from "../utils/errorHandler.js";
import { implementoBodySchema, implementoIdSchema } from "../schema/implemento.schema.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import ImplementoService from "../services/implemento.service.js";

/**
 * crea un nuevo implemento
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function createImplemento (req, res) {
    try {
        const { body } = req;
        const {error: bodyError} = implementoBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);
        
        const [newImplemento, implementoError] = await ImplementoService.createImplemento(body);

        if (implementoError) return respondError(req, res, 400, implementoError);
        if (!newImplemento) {
            return respondError(req, res, 400, "No se creó el implemento");
        }

        respondSuccess(req, res, 201, newImplemento);
    }
    catch (error) {
        handleError(error, "implemento.service -> createImplemento");
        respondError(req, res, 500, "No se creó el implemento");
    }
}

/**
 * Obtiene todos los implementos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getImplementos (req, res) {
    try {
        const [implementos, errorImplementos] = await ImplementoService.getImplementos();
        if (errorImplementos) return respondError(req, res, 404, errorImplementos);

        implementos.length === 0
        ? respondSuccess(req, res, 204)
        : respondSuccess(req, res, 200, implementos);
    }
    catch (error) {
        handleError(error, "implemento.controller -> getImplementos");
        respondError(req, res, 400, error.message);
    }

}


/**
 * Obtiene un implemento por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function getImplemento (req, res) {
    try {
        const { id } = req.params;
        const { error: idError } = implementoIdSchema.validate({ id });
        if (idError) return respondError(req, res, 400, idError.message);

        const [implemento, errorImplemento] = await ImplementoService.getImplemento(id);
        if (errorImplemento) return respondError(req, res, 404, errorImplemento);

        respondSuccess(req, res, 200, implemento);
    }
    catch (error) {
        handleError(error, "implemento.controller -> getImplemento");
        respondError(req, res, 400, error.message);
    }

}

/**
 * Actualiza un implemento
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function updateImplemento (req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const { error: idError } = implementoIdSchema.validate({ id });
        if (idError) return respondError(req, res, 400, idError.message);

        const { error: bodyError } = implementoBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [updatedImplemento, errorImplemento] = await ImplementoService.updateImplemento(id, body);
        if (errorImplemento) return respondError(req, res, 404, errorImplemento);

        respondSuccess(req, res, 200, updatedImplemento);
    }
    catch (error) {
        handleError(error, "implemento.controller -> updateImplemento");
        respondError(req, res, 400, error.message);
    }

}

/**
 * Elimina un implemento
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */

async function deleteImplemento (req, res) {
    try {
        const { id } = req.params;
        const { error: idError } = implementoIdSchema.validate({ id });
        if (idError) return respondError(req, res, 400, idError.message);

        const [deletedImplemento, errorImplemento] = await ImplementoService.deleteImplemento(id);
        if (errorImplemento) return respondError(req, res, 404, errorImplemento);

        respondSuccess(req, res, 200, deletedImplemento);
    }
    catch (error) {
        handleError(error, "implemento.controller -> deleteImplemento");
        respondError(req, res, 400, error.message);
    }

}


export default { createImplemento, getImplementos, getImplemento, updateImplemento, deleteImplemento };