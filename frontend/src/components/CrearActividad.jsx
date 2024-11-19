import React, { useState } from "react";
import { createActividad } from "../services/actividades.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";

const CrearActividad = () => {
  const [actividad, setActividad] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    lugar: "",
    participantes: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActividad((prevActividad) => ({
      ...prevActividad,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createActividad(actividad);
      showSuccessAlert("Actividad creada correctamente");
      // Limpiar los campos del formulario
      setActividad({
        titulo: "",
        descripcion: "",
        fecha: "",
        hora: "",
        lugar: "",
        participantes: [],
      });
    } catch (error) {
      showErrorAlert("Error al crear actividad");
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mt-8">Crear Actividad</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-600">
            Titulo
          </label>
          <input
            id="titulo"
            name="titulo"
            value={actividad.titulo}
            onChange={handleChange}
            type="text"
            className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-600">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={actividad.descripcion}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-600">
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            value={actividad.fecha}
            onChange={handleChange}
            type="date"
            className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="hora" className="block text-sm font-medium text-gray-600">
            Hora
          </label>
          <input
            id="hora"
            name="hora"
            value={actividad.hora}
            onChange={handleChange}
            type="time"
            className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="lugar" className="block text-sm font-medium text-gray-600">
            Lugar
          </label>
          <input
            id="lugar"
            name="lugar"
            value={actividad.lugar}
            onChange={handleChange}
            type="text"
            className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="participantes" className="block text-sm font-medium text-gray-600">
            Participantes
          </label>
          <input
            id="participantes"
            name="participantes"
            value={actividad.participantes}
            onChange={handleChange}
            type="text"
            placeholder="Agregar participantes"
            className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          Crear Actividad
        </button>
      </form>
    </div>
  );
};

export default CrearActividad;
