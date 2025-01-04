"use strict";

import ActividadesService from "../services/actividades.service.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import { actividadesBodySchema, actividadesIdSchema, confirmarParticipacionSchema } from "../schema/actividades.schema.js";
import User from "../models/user.model.js";
import nodemailerService from "../services/nodemailer.service.js";
import Role from "../models/role.model.js";

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

         const users = await User.find({
            roles: {
              $in: (await Role.find({ name: "user" })).map(role => role._id)
            }
          }).exec();
        if (!users || users.length === 0) {
            return respondError(req, res, 404, "No hay usuarios");
        }

        for (const user of users) {
            let username = user.username;
            let email = user.email;
            let message = `Hola ${username}, se ha creado una nueva actividad en la que puedes participar. Revisa la información en la página de la banda instrumental.`;
            const [emailError] = await nodemailerService.enviarEmail(email, "Nueva actividad", message);
            if(emailError) console.log(`Error al enviar correo a ${username}: ${emailError}`);
        }
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

        const { error: bodyError } = actividadesBodySchema.validate(body, {context:{method:req.method}});
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
 * confirma la participacion de un usuario especifico a si mismo a una actividad
 * rellenando el participanteId con el id del usuario que realiza la peticion
 * @param {Object} req
 * @param {Object} res
 * 
 */
async function confirmarParticipacion(req, res) {
    try {
        const { id, participanteId } = req.params;
        const { body } = req;

        const { error: idError } = actividadesIdSchema.validate({ id });
        if (idError) return respondError(req, res, 400, idError.message);

        const bodyWithId = { ...body, participanteId };
        const { error: bodyError } = confirmarParticipacionSchema.validate(bodyWithId);
        if (bodyError) return respondError(req, res, 400, bodyError.message);

        const user = await User.findById(participanteId);
        if (!user) {
          return respondError(req, res, 404, "No se encontró el usuario que corresponde al id de participante");
        }

       if (user.email !== req.email) {
          return respondError(req, res, 403, "No tienes permiso para realizar esta acción");
        }

        const { participacion, justificacion } = bodyWithId;
        const [updatedActividades, errorActividades] = await ActividadesService.confirmarParticipacion(id, participanteId, participacion, justificacion);
        if (errorActividades) return respondError(req, res, 404, errorActividades);

        respondSuccess(req, res, 200, updatedActividades);
    } catch (error) {
        handleError(error, "actividades.controller -> confirmarParticipacion");
        respondError(req, res, 400, error.message);
    }
}


/**
 * updateParticipante - actualiza el estado del participante en una actividad
 * @param {Object} req
 * @param {Object} res
 */

async function confirmarParticipacionesAdmin(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;

        const { error: idError } = actividadesIdSchema.validate({ id });
        if (idError) return respondError(req, res, 400, idError.message);

       const { participanteId } = req.params;

       const bodyWithId = { ...body, participanteId };
       const { error: bodyError } = confirmarParticipacionSchema.validate(bodyWithId);
       if (bodyError) return respondError(req, res, 400, bodyError.message);

        const { participacion, justificacion } = bodyWithId;

        const [updatedActividades, errorActividades] = await ActividadesService.confirmarParticipacion(id, participanteId, participacion, justificacion);
        if (errorActividades) return respondError(req, res, 404, errorActividades);

        respondSuccess(req, res, 200, updatedActividades);
    } catch (error) {
        handleError(error, "actividades.controller -> confirmarParticipacionesAdmin");
        respondError(req, res, 400, error.message);
    }
}




export default {
    getActividades,
    getActividad,
    createActividades,
    updateActividades,
    deleteActividades,
    confirmarParticipacion,
    confirmarParticipacionesAdmin
};