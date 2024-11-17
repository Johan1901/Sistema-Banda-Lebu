"use strict";

import ActividadesService from "../services/actividades.service.js";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import { actividadesBodySchema, actividadesIdSchema } from "../schema/actividades.schema.js";


/**
 * obtiene las actividades
 * @param {Object} req
 * @param {Object} res
 * 
 */

async function getActividades(req, res) {
    try {
        const [actividades, errorActividades] = await ActividadesService.getActividades();
        if (errorActividades) return respondError(req, res, 404, errorActividades);

        actividades.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, actividades);
    } catch (error) {
        handleError(error, "actividades.controller -> getActividades");
        respondError(req, res, 400, error.message);
    }  
}

/**
 * obtiene una actividad por su id
 * @param {Object} req
 * @param {Object} res
 * 
 */

async function getActividad(req, res) {
    try {
        const { id } = req.params;
        const { error: idError } = actividadesIdSchema.validate({ id });
        if (idError) return respondError(req, res, 400, idError.message);

        const [actividad, errorActividad] = await ActividadesService.getActividad(id);
        if (errorActividad) return respondError(req, res, 404, errorActividad);

        respondSuccess(req, res, 200, actividad);
    } catch (error) {
        handleError(error, "actividades.controller -> getActividad");
        respondError(req, res, 400, error.message);
    }
}

/**
 * crea una actividad
 * @param {Object} req
 * @param {Object} res
 * 
 */

async function createActividades(req, res) {
    try {
        const { body } = req;
        const { error: bodyError } = actividadesBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [newActividades, errorActividades] = await ActividadesService.createActividades(body);
        if (errorActividades) return respondError(req, res, 404, errorActividades);

        respondSuccess(req, res, 201, newActividades);
    } catch (error) {
        handleError(error, "actividades.controller -> createActividades");
        respondError(req, res, 400, error.message);
    }
}


/**
 * actualiza una actividad
 * @param {Object} req
 * @param {Object} res
 * 
 */

async function updateActividades(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const { error: idError } = actividadesIdSchema.validate({ id });
        if (idError) return respondError(req, res, 400, idError.message);

        const { error: bodyError } = actividadesBodySchema.validate(body);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const [updatedActividades, errorActividades] = await ActividadesService.updateActividades(id, body);
        if (errorActividades) return respondError(req, res, 404, errorActividades);

        respondSuccess(req, res, 200, updatedActividades);
    } catch (error) {
        handleError(error, "actividades.controller -> updateActividades");
        respondError(req, res, 400, error.message);
    }

}


/**
 * elimina una actividad
 * @param {Object} req
 * @param {Object} res
 * 
 */

async function deleteActividades(req, res) {
    try {
        const { id } = req.params;
        const { error: idError } = actividadesIdSchema.validate({ id });
        if (idError) return respondError(req, res, 400, idError.message);

        const [deletedActividades, errorActividades] = await ActividadesService.deleteActividades(id);
        if (errorActividades) return respondError(req, res, 404, errorActividades);

        respondSuccess(req, res, 200, deletedActividades);
    } catch (error) {
        handleError(error, "actividades.controller -> deleteActividades");
        respondError(req, res, 400, error.message);
    }
}

/**
 * añade participantes a una actividad
 * @param {Object} req
 * @param {Object} res
 * 
 */

// async function addParticipantes(req, res) {
//     try {
//         const { id } = req.params;
//         const { body } = req;
//         const { error: idError } = actividadesIdSchema.validate({ id });
//         if (idError) return respondError(req, res, 400, idError.message);

//         const { error: bodyError } = actividadesBodySchema.validate(body);
//         if (bodyError) return respondError(req, res, 400, bodyError.message);

//         const [updatedActividades, errorActividades] = await ActividadesService.addParticipantes(id, body);
//         if (errorActividades) return respondError(req, res, 404, errorActividades);

//         respondSuccess(req, res, 200, updatedActividades);
//     } catch (error) {
//         handleError(error, "actividades.controller -> addParticipantes");
//         respondError(req, res, 400, error.message);
//     }

// }

// /**
//  * elimina un participante de una actividad
//  * @param {Object} req
//  * @param {Object} res
//  * 
//  */


// async function deleteParticipante(req, res) {
//     try {
//         const { id } = req.params;
//         const { body } = req;
//         const { error: idError } = actividadesIdSchema.validate({ id });
//         if (idError) return respondError(req, res, 400, idError.message);

//         const { error: bodyError } = actividadesBodySchema.validate(body);
//         if (bodyError) return respondError(req, res, 400, bodyError.message);

//         const [updatedActividades, errorActividades] = await ActividadesService.deleteParticipante(id, body);
//         if (errorActividades) return respondError(req, res, 404, errorActividades);

//         respondSuccess(req, res, 200, updatedActividades);
//     } catch (error) {
//         handleError(error, "actividades.controller -> deleteParticipante");
//         respondError(req, res, 400, error.message);
//     }

// }



export default {
    getActividades,
    getActividad,
    createActividades,
    updateActividades,
    deleteActividades,
    // addParticipantes,
    // deleteParticipante
};