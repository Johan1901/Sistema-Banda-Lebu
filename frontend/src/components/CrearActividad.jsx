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
    });
  const [loading, setLoading] = useState(false);
    const [sendingEmails, setSendingEmails] = useState(false)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setActividad((prevActividad) => ({
            ...prevActividad,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true); // Set loading state while submitting
      setSendingEmails(true)
      try {
          // Simulate sending emails (replace with your actual email sending logic)
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await createActividad(actividad);
          showSuccessAlert("Actividad creada correctamente");
          setActividad({
              titulo: "",
              descripcion: "",
              fecha: "",
              hora: "",
              lugar: "",
          });
           setSendingEmails(false)
      } catch (error) {
        showErrorAlert("Error al crear actividad");
      } finally {
          setLoading(false); // Reset loading state regardless of success or failure
          setSendingEmails(false)
      }
  };


    return (
        <div className="container mx-auto p-4 sm:p-6 bg-gray-100 rounded shadow-md">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
                Crear Actividad
            </h1>
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="space-y-4 mt-4 w-full max-w-md">
                    <div>
                        <label
                            htmlFor="titulo"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
                            Título
                        </label>
                        <input
                            id="titulo"
                            name="titulo"
                            value={actividad.titulo}
                            onChange={handleChange}
                            type="text"
                            placeholder="Ingrese el título de la actividad"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="descripcion"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
                            Descripción
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={actividad.descripcion}
                            onChange={handleChange}
                            placeholder="Escriba una descripción detallada"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div>
                        <label
                            htmlFor="fecha"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
                            Fecha
                        </label>
                        <input
                            id="fecha"
                            name="fecha"
                            value={actividad.fecha}
                            onChange={handleChange}
                            type="date"
                            placeholder="Seleccione una fecha"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="hora"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
                            Hora
                        </label>
                        <input
                            id="hora"
                            name="hora"
                            value={actividad.hora}
                            onChange={handleChange}
                            type="time"
                            placeholder="Ingrese la hora"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="lugar"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
                            Lugar
                        </label>
                        <input
                            id="lugar"
                            name="lugar"
                            value={actividad.lugar}
                            onChange={handleChange}
                            type="text"
                            placeholder="Ingrese el lugar de la actividad"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                     {sendingEmails && (
                        <div className="text-center mt-4">
                            <p className="text-blue-500 text-gray-800">Enviando correos...</p>
                        </div>
                      )}
                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                             disabled={loading}
                        >
                            {loading ? "Creando actividad..." : "Crear Actividad"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearActividad;