import React, { useState, useEffect } from "react";
import {
    deleteInstrumento,
    getInstrumentos,
    updateInstrumento,
    assignedInstrumentToUser,
    unassignedInstrumentToUser
} from "../services/instrumento.service.js";
import { getIntegrantes } from "../services/integrantes.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";

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
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assigningInstrument, setAssigningInstrument] = useState(null);
     const [userMap, setUserMap] = useState({});


    useEffect(() => {
        fetchInstrumentos();
        fetchIntegrantes();
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

   const fetchIntegrantes = async () => {
       try {
           const response = await getIntegrantes();
           console.log("Response from getIntegrantes:", response);
           if (response && response.data) {
               console.log("Integrantes data:", response.data.data);
               setIntegrantes(response.data.data);
                // Create the user map
                 const map = {};
                 response.data.data.forEach(user => {
                   map[user._id] = user.username;
                 });
                 setUserMap(map);
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
                setIsModalOpen(false);
                setEditingInstrumento(null);
                setEditFormData({})
                showSuccessAlert("Instrumento actualizado correctamente");
                fetchInstrumentos();
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
    const handleOpenAssignModal = (instrumento) => {
      setAssigningInstrument(instrumento);
      setSelectedUserId("");
      setIsAssignModalOpen(true);
    };

    const handleCloseAssignModal = () => {
      setIsAssignModalOpen(false);
      setAssigningInstrument(null);
      setSelectedUserId("");
    };

    const handleUserIdChange = (event) => {
        console.log("Selected user ID:", event.target.value);
        setSelectedUserId(event.target.value);
    };

  const handleAssign = async () => {
      if (!assigningInstrument) {
          showErrorAlert("No hay instrumento seleccionado para asignar.");
          return;
      }

      if(!selectedUserId){
            showErrorAlert("El id del usuario es obligatorio.");
          return;
      }
      try {
          const response = await assignedInstrumentToUser(assigningInstrument._id, selectedUserId);
            console.log("Response from assignedInstrumentToUser:", response);
          if (response && response.data) {

              showSuccessAlert("Instrumento asignado correctamente");
               fetchInstrumentos();
              handleCloseAssignModal();
          } else {
              showErrorAlert(response?.message || "Error al asignar el instrumento");
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
          const response = await unassignedInstrumentToUser(instrumento._id, instrumento.asignadoA);
            if (response && response.data) {
              showSuccessAlert("Instrumento desasignado correctamente");
              fetchInstrumentos();

            } else {
                showErrorAlert(response?.message || "Error al desasignar el instrumento.");
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
            <div className="bg-white p-6 rounded-md shadow-md w-96 text-black">
                <h2 className="text-xl font-bold mb-4 text-black">Editar Instrumento</h2>
                <form>
                    {validationError && (
                        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-black">
                            {validationError}
                        </div>
                    )}
                    <div className="mb-4">
                        <label
                            htmlFor="nombre"
                            className="block text-sm font-medium text-gray-700 text-black"
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
                            className="block text-sm font-medium text-gray-700 text-black"
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
                            className="block text-sm font-medium text-gray-700 text-black"
                        >
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={editFormData?.estado || ""}
                            onChange={handleFormChange}
                            className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-black"
                        >
                            <option value="" className="text-black">Selecciona un estado</option>
                            {["buen estado", "utilizable", "mal estado", "en reparacion"].map(
                                (estado) => (
                                    <option key={estado} value={estado} className="text-black">
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
    const renderAssignModal = () => (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center text-black">
        <div className="bg-white p-6 rounded-md shadow-md w-96 text-black">
          <h2 className="text-xl font-bold mb-4 text-black">Asignar Instrumento</h2>
          <p className="mb-4 text-black">Selecciona un integrante para asignar el instrumento:</p>
            <select
              value={selectedUserId}
              onChange={handleUserIdChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 bg-white text-black mb-4"
             >
                <option value="" className="text-black">Selecciona un integrante</option>
                  {integrantes.map(integrante => {
                      return (
                          <option key={integrante._id} value={integrante._id} className="text-black">
                            {integrante.username}
                          </option>
                        )
                      })}
                </select>

          <div className="flex gap-4">
            <button
              onClick={handleAssign}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
            >
              Asignar
            </button>

            <button
              onClick={handleCloseAssignModal}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );

    return (
        <div className="container mx-auto text-black">
            <h1 className="text-3xl font-bold text-center mt-8 text-black">
                Instrumentos
            </h1>
            {error && <p className="text-red-700 text-center text-black">{error}</p>}
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
                        } text-black`}
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
                                    <tr key={instrumento._id} className="border-b border-gray-200 text-black">
                                        <td className="px-4 py-2 text-black">{instrumento.marca}</td>
                                        <td className="px-4 py-2 text-black">{instrumento.estado}</td>
                                          <td className="px-4 py-2 text-black">
                                              {instrumento.asignadoA ? userMap[instrumento.asignadoA] || "Usuario no encontrado" : "-"}
                                          </td>
                                        <td className="px-4 py-2">
                                          {instrumento.asignadoA ? (
                                              <button
                                                  onClick={() => handleDirectUnassign(instrumento)}
                                                  className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                                              >
                                                  Desasignar
                                              </button>
                                          ) : (
                                              <button
                                                onClick={() => handleOpenAssignModal(instrumento)}
                                                className="bg-green-500 text-white py-1 px-3 rounded mr-2"
                                                >
                                                Asignar
                                              </button>
                                          )}


                                            <button
                                                onClick={() => handleEdit(instrumento)}
                                                className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(instrumento._id)}
                                                className="bg-red-500 text-white py-1 px-3 rounded"
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
            {isAssignModalOpen && renderAssignModal()}
        </div>
    );
};

export default VerInstrumentos;