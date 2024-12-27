"use strict";

import mongoose from "mongoose";

const implementoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    instrumento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instrumento",
    },
});

const Implemento = mongoose.model("Implemento", implementoSchema);
export default Implemento;