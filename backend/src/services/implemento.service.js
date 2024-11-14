"use strict";

import Implemento from "../models/implemento.model.js";
import { handleError } from "../utils/errorHandler.js";

async function createImplemento (implemento) {
    try {
        const { nombre, instrumento, stock } = implemento;

        const newImplemento = new Implemento({
            nombre,
            instrumento,
            stock,
        });
        await newImplemento.save();

        return [newImplemento, null];
    }
    catch (error) {
        handleError(error, "implemento.service -> createImplemento");
    }
}

async function getImplementos () {
    try {
        const implementos = await Implemento.find().exec();
        if (!implementos) return [null, "No hay implementos"];

        return [implementos, null];
    }
    catch (error) {
        handleError(error, "implemento.service -> getImplementos");
    }
}

async function getImplemento (id) {
    try {
        const implemento = await Implemento.findById(id).exec();
        if (!implemento) return [null, "No se encontró el implemento"];

        return [implemento, null];
    }
    catch (error) {
        handleError(error, "implemento.service -> getImplemento");
    }
}

async function updateImplemento (id, implemento) {
    try {
        const { nombre, instrumento, stock } = implemento;

        const updatedImplemento = await Implemento.findByIdAndUpdate(id, {
            nombre,
            instrumento,
            stock,
        }, { new: true });
        if (!updatedImplemento) return [null, "No se encontró el implemento"];

        return [updatedImplemento, null];
    }
    catch (error) {
        handleError(error, "implemento.service -> updateImplemento");
    }
}

async function deleteImplemento (id) {
    try {
        const deletedImplemento = await Implemento.findByIdAndDelete(id).exec();
        if (!deletedImplemento) return [null, "No se encontró el implemento"];

        return [deletedImplemento, null];
    }
    catch (error) {
        handleError(error, "implemento.service -> deleteImplemento");
    }
}

export {
    createImplemento,
    getImplementos,
    getImplemento,
    updateImplemento,
    deleteImplemento,
};