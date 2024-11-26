import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteActividad,
  getActividades,
  updateActividad,
} from "../services/actividades.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";

const VerActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActividades();
  }, []);

  const fetchActividades = async () => {
    try {
      const response = await getActividades();
      if (
        response.data &&
        (Array.isArray(response.data.data) || Array.isArray(response.data))
      ) {
        const data = response.data.data || response.data;
        setActividades(data);
      } else {
        setError("Formato inesperado en la respuesta del servidor.");
      }
    } catch (error) {
      setError("No se pudo cargar la lista de actividades.");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      showErrorAlert("ID no válido para eliminar la actividad.");
      return;
    }
    try {
      await deleteActividad(id);
      setActividades((prevActividades) =>
        prevActividades.filter((actividad) => actividad._id !== id)
      );
      showSuccessAlert("Actividad eliminada correctamente");
    } catch (error) {
      showErrorAlert("Error al eliminar actividad.");
    }
  };

  const handleEdit = (actividad) => {
    setSelectedActividad(actividad);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedActividad(null);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await updateActividad(selectedActividad._id, selectedActividad);
      fetchActividades();
      showSuccessAlert("Actividad actualizada correctamente");
      handleModalClose();
    } catch (error) {
      showErrorAlert("Error al actualizar la actividad.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Para la fecha, mantén el valor como una cadena en formato YYYY-MM-DD
    setSelectedActividad((prev) => ({
      ...prev,
      [name]: name === "fecha" ? value : value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Devuelve en formato YYYY-MM-DD
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
              <p className="text-gray-800 text-sm mb-4">
                {actividad.descripcion}
              </p>
              <div className="mb-2">
                <strong className="text-gray-800">Fecha:</strong>{" "}
                <span className="text-gray-800">
                  {formatDate(actividad.fecha)}
                </span>
              </div>
              <div className="mb-2">
                <strong className="text-gray-800">Hora:</strong>{" "}
                <span className="text-gray-800">{actividad.hora}</span>
              </div>
              <div className="mb-2">
                <strong className="text-gray-800">Lugar:</strong>{" "}
                <span className="text-gray-800">{actividad.lugar}</span>
              </div>
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => handleDelete(actividad._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => handleEdit(actividad)}
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

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Editar Actividad
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-black">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={selectedActividad.titulo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black">Descripción</label>
                <textarea
                  name="descripcion"
                  value={selectedActividad.descripcion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={
                    selectedActividad.fecha
                      ? formatDate(selectedActividad.fecha)
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black">Hora</label>
                <input
                  type="time"
                  name="hora"
                  value={selectedActividad.hora}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black">Lugar</label>
                <input
                  type="text"
                  name="lugar"
                  value={selectedActividad.lugar}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-white text-black"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerActividades;
