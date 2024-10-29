"use strict";

const mongoose = require("mongoose");
import MARCA from "../constants/marca.constants.js";
import ESTADO from "../constants/estado.constants.js";
import INSTRUMENTOS from "../constants/instrumentos.constants.js";

const inventarioSchema = new mongoose.Schema(
    {
        instrumento: {
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
        cantidad: {
        type: Number,
        required: true,
        },
    },
);

const Inventario = mongoose.model("Inventario", inventarioSchema);
module.exports = Inventario;