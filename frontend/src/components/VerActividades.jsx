import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteActividad, getActividades, updateActividad } from "../services/actividades.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";

const VerActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch data when the component is mounted
  useEffect(() => {
    fetchActividades();
  }, []);

  // Fetch activities data from the server
  const fetchActividades = async () => {
    try {
      const response = await getActividades();

      // Validación de la estructura de los datos
      if (
        response.data &&
        (Array.isArray(response.data.data) || Array.isArray(response.data))
      ) {
        const data = response.data.data || response.data;
        setActividades(data);
        console.log("Actividades obtenidas:", data);
      } else {
        setError("Formato inesperado en la respuesta del servidor.");
        console.error("Respuesta inesperada:", response);
      }
    } catch (error) {
      console.error("Error al obtener actividades:", error);
      setError("No se pudo cargar la lista de actividades.");
    }
  };

  // Handle activity deletion
  const handleDelete = async (id) => {
    if (!id) {
      console.error("ID no válido para eliminar la actividad.");
      showErrorAlert("ID no válido para eliminar la actividad.");
      return;
    }

    try {
      console.log("Eliminando actividad con ID:", id); // Depuración para ver el id
      await deleteActividad(id);
      console.log("Actividad eliminada:", id);
      setActividades((prevActividades) =>
        prevActividades.filter((actividad) => actividad._id !== id)
      );
      showSuccessAlert("Actividad eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
      showErrorAlert("Error al eliminar actividad.");
    }
  };

  // Function to format the date in dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mt-8">Ver Actividades</h1>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => navigate("/actividades/crear")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Crear Actividad
        </button>
      </div>
      <div className="mt-8">
        {error && <p className="text-red-700 text-center">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {actividades.map((actividad) => (
            <div
              key={actividad._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold text-blue-600 mb-2">
                {actividad.titulo}
              </h3>
              <p className="text-gray-800 text-sm mb-4">{actividad.descripcion}</p>
              <div className="mb-2">
                <strong className="text-gray-800">Fecha:</strong> 
                <span className="text-gray-800">{formatDate(actividad.fecha)}</span>
              </div>
              <div className="mb-2">
                <strong className="text-gray-800">Hora:</strong> 
                <span className="text-gray-800"> {actividad.hora}</span>
              </div>
              <div className="mb-2">
                <strong className="text-gray-800">Lugar:</strong> 
                <span className="text-gray-800"> {actividad.lugar}</span>
              </div>
              <div className="mb-4">
                <strong className="text-gray-800">Participantes:</strong>{" "}
                {actividad.participantes.join(", ")}
              </div>
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => handleDelete(actividad._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => navigate(`/actividades/editar/${actividad._id}`)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
          {actividades.length === 0 && (
            <div className="col-span-4 text-center py-4">
              No hay actividades disponibles.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerActividades;
