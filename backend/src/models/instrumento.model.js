// instrumento.model.js
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
    estado: {
        type: String,
        enum: ESTADO,
        required: true,
    },
    asignadoA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null,
    },
});

const Instrumento = mongoose.model("Instrumento", instrumentoSchema);
export default Instrumento;