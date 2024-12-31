"use strict";

const mongoose = require("mongoose");

const asignarSchema = new mongoose.Schema(
    {
        integrante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Integrante",
        required: true,
        },
        intrumento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instrumento",
        required: true,
        },
        implemento: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Implemento",
        required: true,
        }],
    },
);

const Asignar = mongoose.model("Asignar", asignarSchema);

module.exports = Asignar;