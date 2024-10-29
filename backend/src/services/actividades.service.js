"use strict";

import { handleError } from "../utils/errorHandler.js";
import User from "../models/user.model.js";

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


export default { 
    createActividades 
};