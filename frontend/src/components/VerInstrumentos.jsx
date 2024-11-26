import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteInstrumento, getInstrumentos, updateInstrumento } from "../services/instrumento.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";

const VerInstrumentos = () => {
  const [instrumentos, setInstrumentos] = useState([]);
  const [error, setError] = useState(null);
  const [editingInstrumento, setEditingInstrumento] = useState(null); // Estado para el instrumento en edición
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la visibilidad del modal
  const [validationError, setValidationError] = useState(""); // Estado para manejar errores de validación
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstrumentos();
  }, []);

  const fetchInstrumentos = async () => {
    try {
      const response = await getInstrumentos();
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
    } catch (error) {
      console.error("Error al eliminar instrumento:", error);
      showErrorAlert("Error al eliminar instrumento.");
    }
  };

  const handleEdit = (instrumento) => {
    setEditingInstrumento(instrumento); // Establecer el instrumento seleccionado para edición
    setIsModalOpen(true); // Abrir el modal
    setValidationError(""); // Resetear mensaje de error al editar
  };

  const handleUpdate = async (updatedInstrumento) => {
    // Validación de campos obligatorios
    if (!updatedInstrumento.nombre || !updatedInstrumento.marca || !updatedInstrumento.estado || !updatedInstrumento.implemento) {
      setValidationError("Todos los campos son obligatorios.");
      return;
    }

    try {
      await updateInstrumento(updatedInstrumento._id, updatedInstrumento);
      setInstrumentos((prevInstrumentos) =>
        prevInstrumentos.map((instrumento) =>
          instrumento._id === updatedInstrumento._id ? updatedInstrumento : instrumento
        )
      );
      setIsModalOpen(false);
      showSuccessAlert("Instrumento actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar instrumento:", error);
      showErrorAlert("Error al actualizar instrumento.");
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false); // Cerrar el modal sin realizar cambios
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
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <select
              name="nombre"
              value={editingInstrumento?.nombre || ''}
              onChange={(e) =>
                setEditingInstrumento({ ...editingInstrumento, nombre: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-black"
            >
              <option value="">Selecciona un instrumento</option>
              {["trompeta", "trombon", "baritono", "tuba", "redoble", "platillos", "lira", "clarinete", "saxofon", "bombo"].map((nombre) => (
                <option key={nombre} value={nombre}>
                  {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
            <select
              name="marca"
              value={editingInstrumento?.marca || ''}
              onChange={(e) =>
                setEditingInstrumento({ ...editingInstrumento, marca: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-black"
            >
              <option value="">Selecciona una marca</option>
              {["yamaha", "conn", "jupiter", "baldassare", "vicent bach", "etinger"].map((marca) => (
                <option key={marca} value={marca}>
                  {marca.charAt(0).toUpperCase() + marca.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              name="estado"
              value={editingInstrumento?.estado || ''}
              onChange={(e) =>
                setEditingInstrumento({ ...editingInstrumento, estado: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-black"
            >
              <option value="">Selecciona un estado</option>
              {["buen estado", "utilizable", "mal estado", "en reparacion"].map((estado) => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="implemento" className="block text-sm font-medium text-gray-700">Implemento</label>
            <select
              name="implemento"
              value={editingInstrumento?.implemento || ''}
              onChange={(e) =>
                setEditingInstrumento({ ...editingInstrumento, implemento: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-black"
            >
              <option value="">Selecciona un implemento</option>
              {["-", "atril", "baquetas", "correa de bombo", "correa de redoble", "maceta"].map((implemento) => (
                <option key={implemento} value={implemento}>
                  {implemento.charAt(0).toUpperCase() + implemento.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleUpdate(editingInstrumento)}
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
      <h1 className="text-3xl font-bold text-center mt-8 text-black">Instrumentos</h1>
      {error && <p className="text-red-700 text-center">{error}</p>}
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-4 py-2 border border-gray-300 text-black">Nombre</th>
            <th className="text-left px-4 py-2 border border-gray-300 text-black">Marca</th>
            <th className="text-left px-4 py-2 border border-gray-300 text-black">Estado</th>
            <th className="text-left px-4 py-2 border border-gray-300 text-black">Implemento</th>
            <th className="text-left px-4 py-2 border border-gray-300 text-black">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {instrumentos.length > 0 ? (
            instrumentos.map((instrumento) => (
              <tr key={instrumento._id} className="border-b border-gray-200">
                <td className="px-4 py-2 text-black">{instrumento.nombre}</td>
                <td className="px-4 py-2 text-black">{instrumento.marca}</td>
                <td className="px-4 py-2 text-black">{instrumento.estado}</td>
                <td className="px-4 py-2 text-black">{instrumento.implemento}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(instrumento)}
                    className="bg-blue-500 text-white py-1 px-4 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(instrumento._id)}
                    className="bg-red-500 text-white py-1 px-4 rounded ml-2"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-black">No hay instrumentos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalOpen && renderEditForm()}
    </div>
  );
};

export default VerInstrumentos;
