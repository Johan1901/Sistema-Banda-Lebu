import React, { useState, useEffect } from "react";
import {
  deleteInstrumento,
  getInstrumentos,
  updateInstrumento,
} from "../services/instrumento.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";

const VerInstrumentos = () => {
  const [instrumentos, setInstrumentos] = useState([]);
  const [error, setError] = useState(null);
  const [editingInstrumento, setEditingInstrumento] = useState(null);
    const [editFormData, setEditFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [openInstrumentGroup, setOpenInstrumentGroup] = useState(null);

  useEffect(() => {
    fetchInstrumentos();
  }, []);

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
            const response = await updateInstrumento(editingInstrumento._id, editFormData);
                if (response && response.data) {
                    const updatedInstrument = response.data;
                    setInstrumentos((prevInstrumentos) =>
                        prevInstrumentos.map((instrumento) =>
                            instrumento._id === updatedInstrument._id ? updatedInstrument : instrumento
                        )
                    );
                    setIsModalOpen(false);
                    setEditingInstrumento(null);
                    setEditFormData({})
                    showSuccessAlert("Instrumento actualizado correctamente");
                } else {
                    showErrorAlert("Error al actualizar el instrumento: respuesta inesperada del servidor.");
                }

        } catch (error) {
            console.error("Error al actualizar instrumento:", error);
            showErrorAlert(error?.message || "Error al actualizar instrumento.");
        }
    };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setEditingInstrumento(null);
    setEditFormData({})
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
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Editar Instrumento</h2>
        <form>
          {validationError && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
              {validationError}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={editFormData?.nombre || ""}
              onChange={handleFormChange}
              placeholder="Escribe el nombre del instrumento"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-black"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="marca"
              className="block text-sm font-medium text-gray-700"
            >
              Marca
            </label>
            <input
              type="text"
              name="marca"
              value={editFormData?.marca || ""}
              onChange={handleFormChange}
              placeholder="Escribe la marca del instrumento"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-black"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="estado"
              className="block text-sm font-medium text-gray-700"
            >
              Estado
            </label>
            <select
              name="estado"
                value={editFormData?.estado || ""}
                onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-black"
            >
              <option value="">Selecciona un estado</option>
              {["buen estado", "utilizable", "mal estado", "en reparacion"].map(
                (estado) => (
                  <option key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mt-8 text-black">
        Instrumentos
      </h1>
      {error && <p className="text-red-700 text-center">{error}</p>}
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
            }`}
          >
            <div className="flex items-center">
              <span className="text-black font-bold">
                {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
              </span>
              <span className="text-black ml-4">
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
                className="w-5 h-5 text-black"
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
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left px-4 py-2 border border-gray-300 text-black">
                      Marca
                    </th>
                    <th className="text-left px-4 py-2 border border-gray-300 text-black">
                      Estado
                    </th>
                    <th className="text-left px-4 py-2 border border-gray-300 text-black">
                      Asignado a
                    </th>
                    <th className="text-left px-4 py-2 border border-gray-300 text-black">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {instrumentosGrupo.map((instrumento) => (
                    <tr key={instrumento._id} className="border-b border-gray-200">
                      <td className="px-4 py-2 text-black">{instrumento.marca}</td>
                      <td className="px-4 py-2 text-black">{instrumento.estado}</td>
                      <td className="px-4 py-2 text-black">{instrumento.asignadoA || "-"}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEdit(instrumento)}
                          className="bg-blue-500 text-white py-1 px-3 rounded"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(instrumento._id)}
                          className="bg-red-500 text-white py-1 px-3 rounded ml-2"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
      {isModalOpen && renderEditForm()}
    </div>
  );
};

export default VerInstrumentos;