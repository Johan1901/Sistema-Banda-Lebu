"use strict";
// importa el modulo 'mongoose' para crear la conexion a la base de datos
import mongoose from "mongoose";

// crea el esquema de la coleccion 'actividades'
const actividadesSchema = new mongoose.Schema(
  {
    titulo: {
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
        integrante: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        estado: {
            type: String,
            enum: ['pendiente', 'confirmado', "no participa"],
            default: 'pendiente',
        },
        justificacion: {
            type: String,
            default: null,
        },
      },
    ],
  },
);

const Actividades = mongoose.model("Actividades", actividadesSchema);
export default Actividades;