import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteIntegrante, getIntegrantes } from "../services/integrantes.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";

const VerIntegrantes = () => {
  const [integrantes, setIntegrantes] = useState([]);
  const [loading, setLoading] = useState(true); // Nueva variable de estado para la carga
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Fetch data when the component is mounted
  useEffect(() => {
    fetchIntegrantes();
  }, []);
  
  // Fetch integrantes data from the server
  const fetchIntegrantes = async () => {
    try {
      const response = await getIntegrantes();
    
      // Validación de la estructura de los datos
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
      setLoading(false); // Detener el estado de carga
    }
  };

  // Handle integrante deletion
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

  // Function to format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth is 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900">Integrantes</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/users/crear")}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Crear integrante
        </button>
      </div>
      {loading ? (
        <div className="text-center text-xl text-gray-500">Cargando...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Rut</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Fecha Nacimiento</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Teléfono</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Instrumento</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {integrantes.map((integrante) => (
              <tr key={integrante._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{integrante.username}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{integrante.rut}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{formatDate(integrante.fecha_nacimiento)}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{integrante.telefono}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{integrante.email}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{integrante.instrumento}</td>
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => handleDelete(integrante._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 mr-2"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => navigate(`/integrantes/editar/${integrante._id}`)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VerIntegrantes;
