"use strict";

const mongoose = require("mongoose");
import MARCA from "../constants/marca.constants.js";
import ESTADO from "../constants/estado.constants.js";
import IMPLEMENTO from "../constants/implemento.constants.js";

const instrumentoSchema = new mongoose.Schema({
    nombre: {
        type: String,
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
        enum: IMPLEMENTO,
        required: true,
    },
});

const Instrumento = mongoose.model("Instrumento", instrumentoSchema);
module.exports = Instrumento;