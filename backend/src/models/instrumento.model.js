// Mongoose Schema (instrumento.model.js)
"use strict";

import mongoose from "mongoose";
import ESTADO from "../constants/estado.constants.js";

const instrumentoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    marca: {
        type: String,
        required: true,
    },
    estadoCalidad: {
        type: String,
        enum: ESTADO,
        required: true,
    },
    implemento: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Implemento",
        required: false, // Make implemento optional in the schema
    }],
    asignadoA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null, // Keep default null, as it's optional, but can store a value or null
        required: false, //Make asignadoA optional in the schema
    },
});

const Instrumento = mongoose.model("Instrumento", instrumentoSchema);
export default Instrumento;