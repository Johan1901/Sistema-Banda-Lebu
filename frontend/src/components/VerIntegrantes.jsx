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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntegrante, setSelectedIntegrante] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchIntegrantes();
  }, []);

  const fetchIntegrantes = async () => {
    try {
      const response = await getIntegrantes();
      if (response?.data && Array.isArray(response.data.data)) {
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
    if(id === user._id && user.roles.some(role => role.name === "admin")){
      showErrorAlert("No puedes eliminarte a ti mismo si eres administrador");
      return;
    }
    
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
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate() + 1).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // New function to convert date to ISO format (YYYY-MM-DD)
  const formatToIsoDate = (dateString) => {
        if(!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate() + 1).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

  const handleOpenModal = (integrante) => {
    setSelectedIntegrante(integrante);
    setEditFormData({
        username: integrante.username,
        rut: integrante.rut,
        fecha_nacimiento: integrante.fecha_nacimiento ? formatToIsoDate(integrante.fecha_nacimiento): '',
        telefono: integrante.telefono,
        email: integrante.email,
        instrumento: integrante.instrumento,
    });
    setIsModalOpen(true);
  };

    const handleCloseModal = () => {
    setIsModalOpen(false);
        setSelectedIntegrante(null);
    };

      const handleInputChange = (e) => {
          const { name, value } = e.target;
          setEditFormData(prevData => ({
              ...prevData,
              [name]: value,
          }));
    };


  const handleUpdateSubmit = async () => {
    setLoading(true);
    try {
        if(!selectedIntegrante?._id){
            showErrorAlert("No se puede obtener el id del integrante");
            return;
        }
        console.log("Actualizando integrante con ID:", selectedIntegrante._id, "con la data", editFormData);
      await updateIntegrante(selectedIntegrante._id, editFormData);
      showSuccessAlert("Integrante actualizado correctamente");
      fetchIntegrantes();
      handleCloseModal();
    } catch (error) {
      console.error("Error al actualizar integrante:", error);
      showErrorAlert(error.message);
    } finally {
        setLoading(false);
    }
  };

    const renderActionButtons = (integrante) => {
      if (isAdmin) {
        const isCurrentUser = user?.email=== integrante.email;
        return (
          <td className="px-4 py-2 text-sm">
            <button
              onClick={() => handleOpenModal(integrante)}
              className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2"
            >
              Editar
            </button>
            {!isCurrentUser && (
              <button
                onClick={() => handleDelete(integrante._id)}
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 mr-2"
              >
                Eliminar
              </button>
            )}
          </td>
        );
      }
      return <td className="px-4 py-2 text-sm"></td>;
    };

  return (
    <div className="max-w-7xl mx-auto p-4 text-black">
      <h1 className="text-3xl font-semibold text-center mb-6 text-black">
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
        <>
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
              <tr key={integrante._id} className="border-b hover:bg-gray-50 text-black">
                <td className="px-4 py-2 text-sm text-black">
                  {integrante.username}
                </td>
                <td className="px-4 py-2 text-sm text-black">{integrante.rut}</td>
                <td className="px-4 py-2 text-sm text-black">
                  {formatDate(integrante.fecha_nacimiento)}
                </td>
                <td className="px-4 py-2 text-sm text-black">
                  {integrante.telefono}
                </td>
                <td className="px-4 py-2 text-sm text-black">
                  {integrante.email}
                </td>
                <td className="px-4 py-2 text-sm text-black">
                  {integrante.instrumento}
                </td>
                {renderActionButtons(integrante)}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal */}
            {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-8 rounded-md shadow-md max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Editar Integrante</h2>
              {/* Formulario */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
                <input type="text" name="username" id="username" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                value={editFormData.username || ""} onChange={handleInputChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="rut" className="block text-gray-700 text-sm font-bold mb-2">Rut:</label>
                <input type="text" name="rut" id="rut" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                value={editFormData.rut || ""} onChange={handleInputChange}/>
              </div>
              <div className="mb-4">
                <label htmlFor="fecha_nacimiento" className="block text-gray-700 text-sm font-bold mb-2">Fecha de Nacimiento:</label>
                <input type="date" name="fecha_nacimiento" id="fecha_nacimiento" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                value={editFormData.fecha_nacimiento || ""} onChange={handleInputChange} />
              </div>
              <div className="mb-4">
                <label htmlFor="telefono" className="block text-gray-700 text-sm font-bold mb-2">Teléfono:</label>
                 <input type="text" name="telefono" id="telefono" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                  value={editFormData.telefono || ""} onChange={handleInputChange} />
                </div>
              <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                 <input type="email" name="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                  value={editFormData.email || ""} onChange={handleInputChange} />
               </div>
              <div className="mb-4">
                 <label htmlFor="instrumento" className="block text-gray-700 text-sm font-bold mb-2">Instrumento:</label>
                 <input type="text" name="instrumento" id="instrumento" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                  value={editFormData.instrumento || ""} onChange={handleInputChange} />
              </div>
              <div className="flex justify-end">
                <button onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2">Cancelar</button>
                <button onClick={handleUpdateSubmit} disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    {loading ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        )}
       </>
      )}
    </div>
  );
};

export default VerIntegrantes;