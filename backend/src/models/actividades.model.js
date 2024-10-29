// modelo de actividades para banda instrumental
"use strict";
// importa el modulo 'mongoose' para crear la conexion a la base de datos
const mongoose = require("mongoose");

// crea el esquema de la coleccion 'actividades'
const actividadesSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    hora: {
      type: String,
      required: true,
    },
    lugar: {
      type: String,
      required: true,
    },
    participantes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
);

const Actividades = mongoose.model("Actividades", actividadesSchema);
module.exports = Actividades;