import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteIntegrante,
  getIntegrantes,
  updateIntegrante,
} from "../services/integrantes.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";
import { useAuth } from "../context/AuthContext";

const VerIntegrantes = () => {
  const [integrantes, setIntegrantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.roles?.some((role) => role.name === "admin");

  const [editingIntegrante, setEditingIntegrante] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchIntegrantes();
  }, []);

  const fetchIntegrantes = async () => {
    try {
      const response = await getIntegrantes();
      if (response.data && Array.isArray(response.data.data)) {
        const data = response.data.data;
        setIntegrantes(data);
        console.log("Integrantes obtenidos:", data);
      } else {
        setError("Formato inesperado en la respuesta del servidor.");
        console.error("Respuesta inesperada:", response);
      }
    } catch (error) {
      console.error("Error al obtener integrantes:", error);
      setError("No se pudo cargar la lista de integrantes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("ID no válido para eliminar el integrante.");
      showErrorAlert("ID no válido para eliminar el integrante.");
      return;
    }

    try {
      console.log("Eliminando integrante con ID:", id);
      await deleteIntegrante(id);
      console.log("Integrante eliminado:", id);
      setIntegrantes((prevIntegrantes) =>
        prevIntegrantes.filter((integrante) => integrante._id !== id)
      );
      showSuccessAlert("Integrante eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar integrante:", error);
      showErrorAlert("Error al eliminar integrante.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleEdit = (integrante) => {
    setEditingIntegrante(integrante);
    setEditFormData({
      username: integrante.username,
      rut: integrante.rut,
      fecha_nacimiento: integrante.fecha_nacimiento,
      telefono: integrante.telefono,
      email: integrante.email,
      instrumento: integrante.instrumento,
    });
  };

  const handleCancelEdit = () => {
    setEditingIntegrante(null);
  };

  const handleFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    if (!editingIntegrante) return;

    try {
      await updateIntegrante(editingIntegrante._id, editFormData);
      setIntegrantes((prevIntegrantes) =>
        prevIntegrantes.map((integrante) =>
          integrante._id === editingIntegrante._id
            ? { ...integrante, ...editFormData }
            : integrante
        )
      );
      showSuccessAlert("Integrante actualizado correctamente.");
      setEditingIntegrante(null);
    } catch (error) {
      console.error("Error al actualizar el integrante:", error);
      showErrorAlert("Error al actualizar el integrante.");
    }
  };

  const renderActionButtons = (integrante) => {
    if (isAdmin) {
      return (
        <td className="px-4 py-2 text-sm">
          <button
            onClick={() => handleDelete(integrante._id)}
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 mr-2"
          >
            Eliminar
          </button>
          <button
            onClick={() => handleEdit(integrante)}
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Editar
          </button>
        </td>
      );
    }
    return <td className="px-4 py-2 text-sm"></td>;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900">
        Integrantes
      </h1>
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/users/crear")}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Crear integrante
          </button>
        </div>
      )}
      {loading ? (
        <div className="text-center text-xl text-gray-500">Cargando...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">
                Nombre
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">
                Rut
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">
                Fecha Nacimiento
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">
                Teléfono
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">
                Email
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">
                Instrumento
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {integrantes.map((integrante) => (
              <tr key={integrante._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">
                  {integrante.username}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">{integrante.rut}</td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {formatDate(integrante.fecha_nacimiento)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {integrante.telefono}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {integrante.email}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {integrante.instrumento}
                </td>
                {renderActionButtons(integrante)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editingIntegrante && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Editar Integrante</h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Nombre
              </label>
              <input
                type="text"
                name="username"
                value={editFormData.username}
                onChange={handleFormChange}
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white text-black" // Added background and text color
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="rut"
              >
                Rut
              </label>
              <input
                type="text"
                name="rut"
                value={editFormData.rut}
                onChange={handleFormChange}
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white text-black"// Added background and text color
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="fecha_nacimiento"
              >
                Fecha Nacimiento
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={editFormData.fecha_nacimiento}
                onChange={handleFormChange}
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white text-black" // Added background and text color
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="telefono"
              >
                Teléfono
              </label>
              <input
                type="text"
                name="telefono"
                value={editFormData.telefono}
                onChange={handleFormChange}
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white text-black" // Added background and text color
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleFormChange}
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white text-black"// Added background and text color
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="instrumento"
              >
                Instrumento
              </label>
              <input
                type="text"
                name="instrumento"
                value={editFormData.instrumento}
                onChange={handleFormChange}
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white text-black" // Added background and text color
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerIntegrantes;