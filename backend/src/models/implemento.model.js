"use strict";

import mongoose from "mongoose";
import IMPLEMENTOS from "../constants/implementos.constants.js";

const implementoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        enum: IMPLEMENTOS,
        required: true,
    },
    instrumento: {
        type: String,
        required: false,
    },
    stock: {
        type: Number,
        required: true,
    },
});

const Implemento = mongoose.model("Implemento", implementoSchema);
export default Implemento;