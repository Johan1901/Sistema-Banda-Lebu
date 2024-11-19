import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteInstrumento, getInstrumentos } from "../services/instrumento.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";

const VerInstrumentos = () => {
  const [instrumentos, setInstrumentos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch data when the component is mounted
  useEffect(() => {
    fetchInstrumentos();
  }, []);

  // Fetch instruments data from the server
  const fetchInstrumentos = async () => {
    try {
      const response = await getInstrumentos();

      // Validación de la estructura de los datos
      if (
        response.data &&
        (Array.isArray(response.data.data) || Array.isArray(response.data))
      ) {
        const data = response.data.data || response.data;
        setInstrumentos(data);
        console.log("Instrumentos obtenidos:", data);
      } else {
        setError("Formato inesperado en la respuesta del servidor.");
        console.error("Respuesta inesperada:", response);
      }
    } catch (error) {
      console.error("Error al obtener instrumentos:", error);
      setError("No se pudo cargar la lista de instrumentos.");
    }
  };

  // Handle instrument deletion
  const handleDelete = async (id) => {
    if (!id) {
      console.error("ID no válido para eliminar el instrumento.");
      showErrorAlert("ID no válido para eliminar el instrumento.");
      return;
    }

    try {
      console.log("Eliminando instrumento con ID:", id); // Depuración para ver el id
      await deleteInstrumento(id);
      console.log("Instrumento eliminado:", id);
      setInstrumentos((prevInstrumentos) =>
        prevInstrumentos.filter((instrumento) => instrumento._id !== id)
      );
      showSuccessAlert("Instrumento eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar instrumento:", error);
      showErrorAlert("Error al eliminar instrumento.");
    }
  };

  // Navigate to the instrument editing page
  const handleEdit = (id) => {
    navigate(`/inventario/ver/instrumentos/editar/${id}`);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mt-8 text-black">Instrumentos</h1>
      {error && <p className="text-red-700 text-center">{error}</p>}
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-4 py-2 border border-gray-300 text-black">Nombre</th>
            <th className="text-left px-4 py-2 border border-gray-300 text-black">Marca</th>
            <th className="text-left px-4 py-2 border border-gray-300 text-black">Estado</th>
            <th className="text-left px-4 py-2 border border-gray-300 text-black">Implemento</th>
          </tr>
        </thead>
        <tbody>
          {instrumentos.map((instrumento) => (
            <tr key={instrumento._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border border-gray-300 text-black">{instrumento.nombre}</td>
              <td className="px-4 py-2 border border-gray-300 text-black">{instrumento.marca}</td>
              <td className="px-4 py-2 border border-gray-300 text-black">{instrumento.estado}</td>
              <td className="px-4 py-2 border border-gray-300 text-black">{instrumento.implemento}</td>
              <td className="px-4 py-2 border border-gray-300 flex gap-2">
                <button
                  onClick={() => handleEdit(instrumento._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(instrumento._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {instrumentos.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 py-4 text-black">
                No hay instrumentos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerInstrumentos;
