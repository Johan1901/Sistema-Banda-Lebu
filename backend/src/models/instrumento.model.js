"use strict";

import mongoose from "mongoose";
import MARCA from "../constants/marca.constants.js";
import ESTADO from "../constants/estado.constants.js";
import IMPLEMENTOS from "../constants/implementos.constants.js";
import INSTRUMENTOS from "../constants/instrumentos.constants.js";
const instrumentoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        enum: INSTRUMENTOS,
        required: true,
    },
    marca: {
        type: String,
        enum: MARCA,
        required: true,
    },
    estado: {
        type: String,
        enum: ESTADO,
        required: true,
    },
    implemento: {
        type: String,
        enum: IMPLEMENTOS,
        required: true,
    },
});

const Instrumento = mongoose.model("Instrumento", instrumentoSchema);
export default Instrumento;