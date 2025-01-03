"use strict";

import mongoose from "mongoose";
import ESTADO from "../constants/estado.constants.js";

const implementoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        enum: ESTADO,
        required: true,
    },
});

const Implemento = mongoose.model("Implemento", implementoSchema);
export default Implemento;