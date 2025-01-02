"use strict";

import Instrumento from "../models/instrumento.model.js";
import User from "../models/user.model.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Crea un nuevo instrumento.
 * @param {Object} instrumento - Objeto con la información del instrumento.
 * @returns {[Object|null, Error|null]} - Retorna un array con el nuevo instrumento o un error.
 */
async function createInstrumento(instrumento) {
    try {
        const { nombre, marca, estado, asignadoA } = instrumento;
        const newInstrumento = await Instrumento.create({
            nombre,
            marca,
            estado,
            asignadoA: asignadoA || null
        });

        return [newInstrumento, null];
    } catch (error) {
        handleError(error, "instrumento.service -> createInstrumento");
        return [null, error];
    }
}

/**
 * Obtiene todos los instrumentos.
 * @returns {[Array|null, Error|null]} - Retorna un array de instrumentos o un error.
 */
async function getInstrumentos() {
    try {
         const instrumentos = await Instrumento.find().lean(); // Usamos lean() para mejorar la eficiencia

        if (!instrumentos || instrumentos.length === 0)
            return [null, "No hay instrumentos disponibles"];

        // Popula el nombre del usuario si es que está asignado a alguien
        const instrumentosConUsuario = await Promise.all(
             instrumentos.map(async (instrumento) => {
                if (instrumento.asignadoA !== "libre") {
                const user = await User.findById(instrumento.asignadoA).lean()
                   
                    if(user) {
                        return { ...instrumento, asignadoA: user.nombre };
                    } else {
                    return { ...instrumento, asignadoA: null}    
                    }
                   
                }
               return instrumento;
            })
        );


        return [instrumentosConUsuario, null];
    } catch (error) {
        handleError(error, "instrumento.service -> getInstrumentos");
        return [null, error];
    }
}


/**
 * Obtiene un instrumento por su ID.
 * @param {string} id - ID del instrumento a buscar.
 * @returns {[Object|null, Error|null]} - Retorna el instrumento o un error.
 */
async function getInstrumento(id) {
    try {
        const instrumento = await Instrumento.findById(id).lean();
        if (!instrumento) return [null, "No se encontró el instrumento con el ID proporcionado"];

        if (instrumento.asignadoA !== "libre") {
           const user = await User.findById(instrumento.asignadoA).lean();
           if(user){
             instrumento.asignadoA = user.nombre;
           }else{
            instrumento.asignadoA = null;
           }
          
        }

        return [instrumento, null];
    } catch (error) {
        handleError(error, "instrumento.service -> getInstrumento");
        return [null, error];
    }
}

/**
 * Actualiza un instrumento existente por su ID.
 * @param {string} id - ID del instrumento a actualizar.
 * @param {Object} instrumento - Objeto con la información actualizada del instrumento.
 * @returns {[Object|null, Error|null]} - Retorna el instrumento actualizado o un error.
 */
async function updateInstrumento(id, instrumento) {
    try {
        const { nombre, marca, estado, asignadoA } = instrumento;

        const updatedInstrumento = await Instrumento.findByIdAndUpdate(
            id,
            {
                nombre,
                marca,
                estado,
                asignadoA: asignadoA || null
            },
            { new: true }
        ).exec();

        if (!updatedInstrumento) return [null, "No se encontró el instrumento con el ID proporcionado"];

        return [updatedInstrumento, null];
    } catch (error) {
        handleError(error, "instrumento.service -> updateInstrumento");
        return [null, error];
    }
}

/**
 * Elimina un instrumento por su ID.
 * @param {string} id - ID del instrumento a eliminar.
 * @returns {[Object|null, Error|null]} - Retorna el instrumento eliminado o un error.
 */
async function deleteInstrumento(id) {
    try {
        const deletedInstrumento = await Instrumento.findByIdAndDelete(id).exec();
        if (!deletedInstrumento) return [null, "No se encontró el instrumento con el ID proporcionado"];

        return [deletedInstrumento, null];
    } catch (error) {
        handleError(error, "instrumento.service -> deleteInstrumento");
        return [null, error];
    }
}


/**
 * Asigna un instrumento a un usuario.
 * @param {string} instrumentId - ID del instrumento a asignar.
 * @param {string} userId - ID del usuario al que se asignará el instrumento.
 * @returns {[Object|null, Error|null]} - Retorna el instrumento actualizado o un error.
 */
async function assignInstrumentToUser(instrumentId, userId) {
    try {
        const instrument = await Instrumento.findById(instrumentId);
        const user = await User.findById(userId);

        if (!instrument) return [null, "No se encontró el instrumento con el ID proporcionado"];
        if (!user) return [null, "No se encontró el usuario con el ID proporcionado"];

        // Verificar si el instrumento ya está asignado
        if (instrument.asignadoA !== null) return [null, "El instrumento ya está asignado"];
        
        instrument.asignadoA = userId;
        await instrument.save();

        user.instrumento.push(instrumentId);
        await user.save();

        return [instrument, null]
    } catch (error) {
        handleError(error, "instrumento.service -> assignInstrumentToUser");
        return [null, error];
    }
}


/**
 * Desasigna un instrumento a un usuario.
 * @param {string} instrumentId - ID del instrumento a desasignar.
 * @param {string} userId - ID del usuario al que se desasignará el instrumento.
 * @returns {[Object|null, Error|null]} - Retorna el instrumento actualizado o un error.
 */
async function unassignInstrumentToUser(instrumentId, userId) {
     try {
        const instrument = await Instrumento.findById(instrumentId);
        const user = await User.findById(userId);

        if (!instrument) return [null, "No se encontró el instrumento con el ID proporcionado"];
        if (!user) return [null, "No se encontró el usuario con el ID proporcionado"];

        if(instrument.asignadoA === null) return [null, "El instrumento ya está libre"];

        instrument.asignadoA = null;
        await instrument.save();

        user.instrumento = user.instrumento.filter(id => id.toString() !== instrumentId);
        await user.save();

        return [instrument, null];
    } catch (error) {
        handleError(error, "instrumento.service -> unassignInstrumentToUser");
        return [null, error];
    }
}


export default {
    createInstrumento,
    getInstrumentos,
    getInstrumento,
    updateInstrumento,
    deleteInstrumento,
    assignInstrumentToUser,
    unassignInstrumentToUser
};