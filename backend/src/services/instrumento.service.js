"use strict";

import Instrumento from "../models/instrumento.model.js";
import { handleError } from "../utils/errorHandler.js";
//import Implemento from "../models/implemento.model.js";

async function createInstrumento (instrumento) {
    try {
        const { nombre, marca, estado, implemento } = instrumento;

        const newInstrumento = new Instrumento({
            nombre,
            marca,
            estado,
            implemento
        });
        await newInstrumento.save();

        return [newInstrumento, null];
    }
    catch (error) {
        handleError(error, "instrumento.service -> createInstrumento");
    }
};

async function getInstrumentos () {
    try {
        const instrumentos = await Instrumento.find().exec();
        if (!instrumentos) return [null, "No hay instrumentos"];

        return [instrumentos, null];
    }
    catch (error) {
        handleError(error, "instrumento.service -> getInstrumentos");
    }
}

async function getInstrumento (id) {
    try {
        const instrumento = await Instrumento.findById(id).exec();
        if (!instrumento) return [null, "No se encontró el instrumento"];

        return [instrumento, null];
    }
    catch (error) {
        handleError(error, "instrumento.service -> getInstrumento");
    }
}

async function updateInstrumento (_id, instrumento) {
    try {
        const { nombre, marca, estado, implemento} = instrumento;

        const updatedInstrumento = await Instrumento.findByIdAndUpdate(_id, {
            nombre,
            marca,
            estado,
            implemento
        }, { new: true });
        if (!updatedInstrumento) return [null, "No se encontró el instrumento"];

        return [updatedInstrumento, null];
    }
    catch (error) {
        handleError(error, "instrumento.service -> updateInstrumento");
    }
}

async function deleteInstrumento (id) {
    try {
        const deletedInstrumento = await Instrumento.findByIdAndDelete(id).exec();
        if (!deletedInstrumento) return [null, "No se encontró el instrumento"];

        return [deletedInstrumento, null];
    }
    catch (error) {
        handleError(error, "instrumento.service -> deleteInstrumento");
    }
}

export default{
    createInstrumento,
    getInstrumentos,
    getInstrumento,
    updateInstrumento,
    deleteInstrumento
};