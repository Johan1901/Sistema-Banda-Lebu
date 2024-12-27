"use strict";

const mongoose = require("mongoose");

const inventarioSchema = new mongoose.Schema(
    {
        intrumento: {
        type: String,
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