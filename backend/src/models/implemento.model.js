"use strict";

const mongoose = require("mongoose");


const implementoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    instrumento: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
});

const Implemento = mongoose.model("Implemento", implementoSchema);
module.exports = Implemento;