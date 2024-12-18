import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteActividad,
  getActividades,
  updateActividad,
} from "../services/actividades.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";
import { getIntegrantes } from "../services/integrantes.service.js";

const VerActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [integrantes, setIntegrantes] = useState([]);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalParticipantesVisible, setModalParticipantesVisible] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [selectedParticipantes, setSelectedParticipantes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActividades();
    fetchIntegrantes();
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

  const fetchIntegrantes = async () => {
    try {
      const response = await getIntegrantes();
      if (response.data && Array.isArray(response.data.data)) {
        const data = response.data.data;
        setIntegrantes(data);
      } else {
        setError("Formato inesperado en la respuesta del servidor.");
      }
    } catch (error) {
      setError("No se pudo cargar la lista de integrantes.");
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

  const handleViewParticipants = (actividad) => {
    // Filtra los participantes para obtener sus estados
    setSelectedParticipantes(actividad.participantes || []);
    setModalParticipantesVisible(true);
  };

  const getParticipantStatusColor = (status) => {
    switch (status) {
      case "confirmado":
        return "bg-green-500";
      case "bajado":
        return "bg-red-500";
      default:
        return "bg-gray-500"; // Para los no confirmados
    }
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
              <div className="mb-2">
                <strong className="text-gray-800">Participantes:</strong>
                <button
                  onClick={() => handleViewParticipants(actividad)}
                  className="bg-gray hover:bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded"
                >
                  ...
                </button>
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

      {/* Modal de Participantes */}
      {modalParticipantesVisible && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Participantes
            </h2>
            <ul className="space-y-2">
              {selectedParticipantes.map((participante) => (
                <li
                  key={participante._id}
                  className={`p-2 rounded bg-white text-black ${getParticipantStatusColor(participante.estado)}`}
                >
                  {participante.username}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setModalParticipantesVisible(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {modalVisible && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-black">Editar Actividad</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Título
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={selectedActividad.titulo}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={selectedActividad.descripcion}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="fecha"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha
                </label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={formatDate(selectedActividad.fecha)}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="hora"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hora
                </label>
                <input
                  type="time"
                  id="hora"
                  name="hora"
                  value={selectedActividad.hora}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="lugar"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lugar
                </label>
                <input
                  type="text"
                  id="lugar"
                  name="lugar"
                  value={selectedActividad.lugar}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                >
                  Guardar cambios
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