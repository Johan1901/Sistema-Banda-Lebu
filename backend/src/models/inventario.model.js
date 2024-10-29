"use strict";

const mongoose = require("mongoose");
import INSTRUMENTOS from "../constants/instrumentos.constants.js";

const inventarioSchema = new mongoose.Schema(
    {
        instrumento: {
        type: String,
        enum: INSTRUMENTOS,
        required: true,
        },
        stock: {
        type: Number,
        required: true,
        },
    },
);

const Inventario = mongoose.model("Inventario", inventarioSchema);
module.exports = Inventario;