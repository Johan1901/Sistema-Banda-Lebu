import React, { useState, useEffect } from "react";
import {
  deleteInstrumento,
  getInstrumentos,
  updateInstrumento,
  assignedInstrumentToUser,
  unassignedInstrumentToUser,
} from "../services/instrumento.service.js";
import { getIntegrantes } from "../services/integrantes.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";
import { useNavigate } from "react-router-dom";

const VerInstrumentos = () => {
  const [instrumentos, setInstrumentos] = useState([]);
  const [error, setError] = useState(null);
  const [editingInstrumento, setEditingInstrumento] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [openInstrumentGroup, setOpenInstrumentGroup] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [integrantes, setIntegrantes] = useState([]);
  const [filteredIntegrantes, setFilteredIntegrantes] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningInstrument, setAssigningInstrument] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMap, setUserMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstrumentos();
    fetchIntegrantes();
  }, []);

  useEffect(() => {
    setFilteredIntegrantes(
      integrantes.filter((integrante) =>
        integrante.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, integrantes]);

  const fetchInstrumentos = async () => {
    try {
      const response = await getInstrumentos();
      if (
        response?.data &&
        (Array.isArray(response.data.data) || Array.isArray(response.data))
      ) {
        const data = response.data.data || response.data;
        setInstrumentos(data);
      } else {
        setError("Formato inesperado en la respuesta del servidor.");
      }
    } catch (error) {
      console.error("Error al obtener instrumentos:", error);
      setError("No se pudo cargar la lista de instrumentos.");
    }
  };

  const fetchIntegrantes = async () => {
    try {
      const response = await getIntegrantes();
      console.log("Response from getIntegrantes:", response);
      if (response && response.data) {
        console.log("Integrantes data:", response.data.data);
        setIntegrantes(response.data.data);
        // Create the user map
        const map = {};
        response.data.data.forEach((user) => {
          map[user._id] = user.username;
        });
        setUserMap(map);
        setFilteredIntegrantes(response.data.data);
      } else {
        setError("Error al obtener la lista de integrantes.");
      }
    } catch (error) {
      console.error("Error al obtener integrantes:", error);
      setError("No se pudo cargar la lista de integrantes.");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      showErrorAlert("ID no válido para eliminar el instrumento.");
      return;
    }
    try {
      await deleteInstrumento(id);
      setInstrumentos((prevInstrumentos) =>
        prevInstrumentos.filter((instrumento) => instrumento._id !== id)
      );
      showSuccessAlert("Instrumento eliminado correctamente");
      if (editingInstrumento?._id === id) {
        setIsModalOpen(false);
        setEditingInstrumento(null);
      }
    } catch (error) {
      console.error("Error al eliminar instrumento:", error);
      showErrorAlert(error?.message || "Error al eliminar instrumento.");
    }
  };

  const handleEdit = (instrumento) => {
    setEditingInstrumento(instrumento);
    setEditFormData({
      nombre: instrumento.nombre,
      marca: instrumento.marca,
      estado: instrumento.estado,
      asignadoA: instrumento.asignadoA || null, // Preserve the assigned user ID
    });
    setIsModalOpen(true);
    setValidationError("");
  };

  const handleFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    if (!editingInstrumento) {
      showErrorAlert("No hay datos para actualizar.");
      return;
    }
    try {
      const response = await updateInstrumento(
        editingInstrumento._id,
        editFormData
      );
      if (response && response.data) {
        setIsModalOpen(false);
        setEditingInstrumento(null);
        setEditFormData({});
        showSuccessAlert("Instrumento actualizado correctamente");
        fetchInstrumentos();
      } else {
        showErrorAlert(
          "Error al actualizar el instrumento: respuesta inesperada del servidor."
        );
      }
    } catch (error) {
      console.error("Error al actualizar instrumento:", error);
      showErrorAlert(error?.message || "Error al actualizar instrumento.");
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setEditingInstrumento(null);
    setEditFormData({});
  };
  const handleOpenAssignModal = (instrumento) => {
    setAssigningInstrument(instrumento);
    setSelectedUserId("");
    setIsAssignModalOpen(true);
    setSearchQuery(""); // Reset search query when opening modal
    setFilteredIntegrantes(integrantes);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setAssigningInstrument(null);
    setSelectedUserId("");
    setSearchQuery("");
  };

  const handleUserIdChange = (event) => {
    console.log("Selected user ID:", event.target.value);
    setSelectedUserId(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAssign = async () => {
    if (!assigningInstrument) {
      showErrorAlert("No hay instrumento seleccionado para asignar.");
      return;
    }

    if (!selectedUserId) {
      showErrorAlert("El id del usuario es obligatorio.");
      return;
    }
    try {
      const response = await assignedInstrumentToUser(
        assigningInstrument._id,
        selectedUserId
      );
      console.log("Response from assignedInstrumentToUser:", response);
      if (response && response.data) {
        showSuccessAlert("Instrumento asignado correctamente");
        fetchInstrumentos();
        handleCloseAssignModal();
      } else {
        showErrorAlert(
          response?.message || "Error al asignar el instrumento"
        );
      }
    } catch (error) {
      console.error("Error al asignar instrumento:", error);
      showErrorAlert(error?.message || "Error al asignar instrumento.");
    }
  };
  const handleDirectUnassign = async (instrumento) => {
    if (!instrumento || !instrumento.asignadoA) {
      showErrorAlert("No hay usuario asignado a este instrumento.");
      return;
    }
    try {
      const response = await unassignedInstrumentToUser(
        instrumento._id,
        instrumento.asignadoA
      );
      if (response && response.data) {
        showSuccessAlert("Instrumento desasignado correctamente");
        fetchInstrumentos();
      } else {
        showErrorAlert(
          response?.message || "Error al desasignar el instrumento."
        );
      }
    } catch (error) {
      console.error("Error al desasignar instrumento:", error);
      showErrorAlert(error?.message || "Error al desasignar instrumento.");
    }
  };

  const groupedInstruments = instrumentos.reduce((acc, instrumento) => {
    if (!acc[instrumento.nombre]) {
      acc[instrumento.nombre] = [];
    }
    acc[instrumento.nombre].push(instrumento);
    return acc;
  }, {});

  const toggleInstrumentGroup = (nombre) => {
    setOpenInstrumentGroup(openInstrumentGroup === nombre ? null : nombre);
  };

  const renderEditForm = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md text-black">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Editar Instrumento
        </h2>
        <form>
          {validationError && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-black">
              {validationError}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={editFormData?.nombre || ""}
              onChange={handleFormChange}
              placeholder="Escribe el nombre del instrumento"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="marca"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Marca
            </label>
            <input
              type="text"
              name="marca"
              value={editFormData?.marca || ""}
              onChange={handleFormChange}
              placeholder="Escribe la marca del instrumento"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="estado"
              className="block text-sm font-medium text-gray-700 text-left"
            >
              Estado
            </label>
            <select
              name="estado"
              value={editFormData?.estado || ""}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-gray-800"
            >
              <option value="" className="text-gray-700">
                Selecciona un estado
              </option>
              {["buen estado", "utilizable", "mal estado", "en reparacion"].map(
                (estado) => (
                  <option key={estado} value={estado} className="text-gray-700">
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>
          {editingInstrumento?.asignadoA && (
            <div className="mb-4">
              <label
                htmlFor="asignadoA"
                className="block text-sm font-medium text-gray-700 text-left"
              >
                Asignado a
              </label>
              <input
                type="text"
                name="asignadoA"
                value={
                  userMap[editFormData?.asignadoA] ||
                  "No asignado"
                }
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-gray-100 text-gray-700"
              />
            </div>
          )}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  const renderAssignModal = () => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center text-black">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md text-black">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Asignar Instrumento
        </h2>
        <p className="mb-4 text-gray-700">
          Selecciona un integrante para asignar el instrumento:
        </p>
        <input
          type="text"
          placeholder="Buscar integrante..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full border border-gray-300 rounded-md p-2 mt-1 mb-4 bg-white text-gray-800"
        />
        <div className="max-h-40 overflow-y-auto">
          {filteredIntegrantes.map((integrante) => (
            <button
              key={integrante._id}
              onClick={() =>
                handleUserIdChange({ target: { value: integrante._id } })
              }
              className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
                selectedUserId === integrante._id ? "bg-gray-400" : ""
              } `}
            >
              {integrante.username}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleAssign}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Asignar
          </button>

          <button
            onClick={handleCloseAssignModal}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 text-black">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mt-4 sm:mt-8 text-gray-800">
        Instrumentos
      </h1>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => navigate("/inventario/crear/instrumento")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Crear Instrumento
        </button>
      </div>
      {error && (
        <p className="text-red-700 text-center text-gray-800">{error}</p>
      )}
      {Object.entries(groupedInstruments).map(([nombre, instrumentosGrupo]) => (
        <div
          key={nombre}
          className="mt-4 border border-gray-300 rounded-md overflow-hidden"
        >
          <button
            onClick={() => toggleInstrumentGroup(nombre)}
            className={`w-full text-left p-4 flex items-center justify-between ${
              openInstrumentGroup === nombre
                ? "bg-gray-200"
                : "bg-gray-100 hover:bg-gray-200"
            } text-gray-800`}
          >
            <div className="flex items-center">
              <span className="text-gray-800 font-bold">
                {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
              </span>
              <span className="text-gray-600 ml-4">
                Stock: {instrumentosGrupo.length}
              </span>
            </div>
            <span
              className={`transition-transform duration-200 ${
                openInstrumentGroup === nombre ? "rotate-180" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 text-gray-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>
          </button>
          {openInstrumentGroup === nombre && (
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left px-4 py-2 border border-gray-300 text-gray-800">
                        Marca
                      </th>
                      <th className="text-left px-4 py-2 border border-gray-300 text-gray-800">
                        Estado
                      </th>
                      <th className="text-left px-4 py-2 border border-gray-300 text-gray-800">
                        Asignado a
                      </th>
                      <th className="text-left px-4 py-2 border border-gray-300 text-gray-800">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {instrumentosGrupo.map((instrumento) => (
                      <tr
                        key={instrumento._id}
                        className="border-b border-gray-200 text-gray-800"
                      >
                        <td className="px-4 py-2 text-gray-800">
                          {instrumento.marca}
                        </td>
                        <td className="px-4 py-2 text-gray-800">
                          {instrumento.estado}
                        </td>
                        <td className="px-4 py-2 text-gray-800">
                          {instrumento.asignadoA
                            ? userMap[instrumento.asignadoA] ||
                              "Usuario no encontrado"
                            : "-"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {instrumento.asignadoA ? (
                            <button
                              onClick={() => handleDirectUnassign(instrumento)}
                              className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded mr-2"
                            >
                              Desasignar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenAssignModal(instrumento)}
                              className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded mr-2"
                            >
                              Asignar
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(instrumento)}
                            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded mr-2"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(instrumento._id)}
                            className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
      {isModalOpen && renderEditForm()}
      {isAssignModalOpen && renderAssignModal()}
    </div>
  );
};

export default VerInstrumentos;