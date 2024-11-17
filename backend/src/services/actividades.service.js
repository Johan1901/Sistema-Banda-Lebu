"use strict";

import { handleError } from "../utils/errorHandler.js";
//import User from "../models/user.model.js";
import Actividades from "../models/actividades.model.js";

async function createActividades(actividades){
    try{
    const { titulo, descripcion, fecha, hora, lugar, participantes } = actividades;

    const newActividades = new Actividades({
        titulo,
        descripcion,
        fecha,
        hora,
        lugar,
        participantes,
    });
    await newActividades.save();
    return [newActividades, null];
    } catch (error) {
        handleError(error, "actividades.service -> createActividades");
    }
}


async function getActividades(){
    try {
        const actividades = await Actividades.find().exec();
        if (!actividades) return [null, "No hay actividades"];

        return [actividades, null];
    }
    catch (error) {
        handleError(error, "actividades.service -> getActividades");
    }
}

async function getActividad(id){
    try {
        const actividad = await Actividades.findById(id).exec();
        if (!actividad) return [null, "No se encontró la actividad"];

        return [actividad, null];
    }
    catch (error) {
        handleError(error, "actividades.service -> getActividad");
    }
}

async function updateActividades(_id, actividades){
    try {
        const { titulo, descripcion, fecha, hora, lugar, participantes } = actividades;

        const updatedActividades = await Actividades.findByIdAndUpdate(_id, {
            titulo,
            descripcion,
            fecha,
            hora,
            lugar,
            participantes
        }, { new: true });
        if (!updatedActividades) return [null, "No se encontró la actividad"];
        return [updatedActividades, null];
    }
    catch (error) {
        handleError(error, "actividades.service -> updateActividades");
    }
}

async function deleteActividades(id){
    try {
        const deletedActividades = await Actividades.findByIdAndDelete(id).exec();
        if (!deletedActividades) return [null, "No se encontró la actividad"];
        return [deletedActividades, null];
    }
    catch (error) {
        handleError(error, "actividades.service -> deleteActividades");
    }
}

// funcion para agregar a todos los participantes a una actividad
// async function addParticipantes(id, participantes){
//     try {
//         const updatedActividades = await Actividades.findByIdAndUpdate(id, {
//             participantes
//         }, { new: true });
//         if (!updatedActividades) return [null, "No se encontró la actividad"];
//         return [updatedActividades, null];
//     }
//     catch (error) {
//         handleError(error, "actividades.service -> addParticipantes");
//     }
// }

// // funcion para eliminar a un participante de una actividad
// async function deleteParticipante(id, participante){
//     try {
//         const updatedActividades = await Actividades.findByIdAndUpdate(id, {
//             $pull: { participantes: participante }
//         }, { new: true });
//         if (!updatedActividades) return [null, "No se encontró la actividad"];
//         return [updatedActividades, null];
//     }
//     catch (error) {
//         handleError(error, "actividades.service -> deleteParticipante");
//     }
// }

// //funcion para actualizar la participacion de un usuario en una actividad
// async function updateParticipante(id, participante, participacion){
//     try {
//         const updatedActividades = await Actividades.findByIdAndUpdate
//         (id, { $set: { "participantes.$[elem].participacion" : participacion } },
//         { arrayFilters: [{ "elem.usuario": participante }], new: true });
//         if (!updatedActividades) return [null, "No se encontró la actividad"];
//         return [updatedActividades, null];
//     }
//     catch (error) {
//         handleError(error, "actividades.service -> updateParticipante");
//     }
    
// }



export default { 
    createActividades,
    getActividades,
    getActividad,
    updateActividades,
    deleteActividades,
    // addParticipantes,
    // deleteParticipante,
    // updateParticipante
};