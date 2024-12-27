"use strict";

import { handleError } from "../utils/errorHandler.js";
import Actividades from "../models/actividades.model.js";
import User from "../models/user.model.js";

async function createActividades(actividades) {
    try {
        // Busca los usuarios excepto el admin y extrae solo sus IDs
        const usuarios = await User.find({ role: { $ne: "admin" } }).exec();
        const participantes = usuarios.map((usuario) => ({
            integrante: usuario._id,
            estado: "pendiente",
        }));

        const { titulo, descripcion, fecha, hora, lugar } = actividades;
        const actividad = new Actividades({
            titulo,
            descripcion,
            fecha,
            hora,
            lugar,
            participantes

        });
        await actividad.save();
        // Devuelve la actividad creada
        return [actividad, null];
    } catch (error) {
        handleError(error, "actividades.service -> createActividades");
        return [null, error.message];
    }
}

async function getActividades() {
    try {
        // Obtén todas las actividades y usa populate para traer los participantes con su nombre
        const actividades = await Actividades.find()
            .populate({
              path: "participantes.integrante",
              select: ["username", "email"],
            })
            .exec();

        // Si no hay actividades, devuelve un mensaje de error
        if (!actividades || actividades.length === 0) {
            return [null, "No hay actividades"];
        }

        // Devuelve las actividades con los participantes populados
        return [actividades, null];
    } catch (error) {
        handleError(error, "actividades.service -> getActividades");
        return [null, error.message]; // En caso de error, devuelve el mensaje de error
    }
}

async function getActividad(id) {
    try {
        const actividad = await Actividades.findById(id)
        .populate({
            path: "participantes.integrante",
            select: ["username", "email"],
          })
        .exec();
        if (!actividad) return [null, "No se encontró la actividad"];

        return [actividad, null];
    }
    catch (error) {
        handleError(error, "actividades.service -> getActividad");
        return [null, error.message]
    }
}

async function updateActividades(id, actividades) {
    try {
        const { titulo, descripcion, fecha, hora, lugar, participantes } = actividades;
        const updatedActividades = await Actividades.findByIdAndUpdate(
            id,
            {
                titulo,
                descripcion,
                fecha,
                hora,
                lugar,
                participantes
            },
            { new: true }
        ).exec();
        if (!updatedActividades) return [null, "No se encontró la actividad"];
        return [updatedActividades, null];
    }
    catch (error) {
        handleError(error, "actividades.service -> updateActividades");
        return [null, error.message]
    }
}

async function deleteActividades(id) {
    try {
        const deletedActividades = await Actividades.findByIdAndDelete(id).exec();
        if (!deletedActividades) return [null, "No se encontró la actividad"];
        return [deletedActividades, null];
    }
    catch (error) {
        handleError(error, "actividades.service -> deleteActividades");
        return [null, error.message]
    }
}

//confirma la participacion de un usuario en una actividad
async function confirmarParticipacion(id, participanteId, participacion, justificacion) {
    try {
        let update = { $set: { "participantes.$.estado": participacion } };

        if (participacion === "no participa" && justificacion) {
            update = {
                $set: {
                    "participantes.$.estado": participacion,
                    "participantes.$.justificacion": justificacion
                }
            };
        }

        const updatedActividades = await Actividades.findOneAndUpdate(
            { _id: id, "participantes.integrante": participanteId },
            update,
            { new: true }
        ).exec();
        if (!updatedActividades) return [null, "No se encontró la actividad o el participante"];
        return [updatedActividades, null];
    } catch (error) {
        handleError(error, "actividades.service -> confirmarParticipacion");
        return [null, error.message];
    }
}

export default {
    createActividades,
    getActividades,
    getActividad,
    updateActividades,
    deleteActividades,
    confirmarParticipacion
};