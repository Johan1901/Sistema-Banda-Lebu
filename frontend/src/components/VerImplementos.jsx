import React, { useState, useEffect } from "react";
import {
    getImplementos,
    updateImplemento,
    deleteImplemento
} from "../services/implemento.service.js";
import { useNavigate } from "react-router-dom";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";

const VerImplementos = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [implementos, setImplementos] = useState([]);
    const [openImplementGroup, setOpenImplementGroup] = useState(null);
    const [editingImplemento, setEditingImplemento] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [validationError, setValidationError] = useState("");

    useEffect(() => {
        fetchImplementos();
    }, []);

    const fetchImplementos = async () => {
        try {
            const response = await getImplementos();
            if (
                response?.data &&
                (Array.isArray(response.data.data) || Array.isArray(response.data))
            ) {
                const data = response.data.data || response.data;
                const sortedData = [...data].sort((a, b) =>
                    a.nombre.localeCompare(b.nombre)
                );
                setImplementos(sortedData);
            } else {
                setError("Error al obtener implementos: formato de respuesta inesperado.");
            }
        } catch (error) {
            console.error("Error al obtener implementos:", error);
            setError("Error al obtener implementos.");
        }
    };

    const toggleImplementGroup = (nombre) => {
        setOpenImplementGroup(openImplementGroup === nombre ? null : nombre);
    };

    const groupedImplementos = implementos.reduce((acc, implemento) => {
        if (!acc[implemento.nombre]) {
            acc[implemento.nombre] = [];
        }
        acc[implemento.nombre].push(implemento);
        return acc;
    }, {});

    const handleDelete = async (id) => {
        if (!id) {
            showErrorAlert("ID no válido para eliminar el implemento.");
            return;
        }
        try {
            await deleteImplemento(id);
            setImplementos((prevImplementos) =>
                prevImplementos.filter((implemento) => implemento._id !== id)
            );
            showSuccessAlert("Implemento eliminado correctamente");
             if (editingImplemento?._id === id) {
                 setIsModalOpen(false);
                 setEditingImplemento(null);
            }
        } catch (error) {
            console.error("Error al eliminar implemento:", error);
            showErrorAlert(error?.message || "Error al eliminar implemento.");
        }
    };

    const handleEdit = (implemento) => {
        setEditingImplemento(implemento);
        setEditFormData({
             nombre: implemento.nombre,
            estado: implemento.estado,
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
         if (!editingImplemento) {
            showErrorAlert("No hay datos para actualizar.");
            return;
        }
        try {
             const response = await updateImplemento(editingImplemento._id, editFormData);
            if (response && response.data) {
                setIsModalOpen(false);
                setEditingImplemento(null);
                 setEditFormData({})
                showSuccessAlert("Implemento actualizado correctamente");
                fetchImplementos();
            } else {
                showErrorAlert("Error al actualizar el implemento: respuesta inesperada del servidor.");
            }
        } catch (error) {
             console.error("Error al actualizar implemento:", error);
            showErrorAlert(error?.message || "Error al actualizar implemento.");
        }
    };

    const handleCancelEdit = () => {
        setIsModalOpen(false);
         setEditingImplemento(null);
         setEditFormData({})
    };

    const renderEditForm = () => (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-md w-96 text-black">
                <h2 className="text-xl font-bold mb-4 text-black">Editar Implemento</h2>
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
                            placeholder="Escribe el nombre del implemento"
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

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded shadow-md text-black">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Implementos</h1>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate("/inventario/crear/implemento")}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                >
                    Crear Implemento
                </button>
            </div>
            {error && <p className="text-red-700 text-center">{error}</p>}

            {Object.entries(groupedImplementos).map(([nombre, implementosGrupo]) => (
                <div
                    key={nombre}
                    className="mt-4 border border-gray-300 rounded-md overflow-hidden"
                >
                    <button
                        onClick={() => toggleImplementGroup(nombre)}
                         className={`w-full text-left p-4 flex items-center justify-between ${
                            openImplementGroup === nombre
                                ? "bg-gray-200"
                                : "bg-gray-100 hover:bg-gray-200"
                        } text-black`}
                    >
                        <div className="flex items-center">
              <span className="font-bold text-black">
                {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
              </span>
                            <span className="text-black ml-4">
                Stock: {implementosGrupo.length}
              </span>
                        </div>
                        <span
                            className={`transition-transform duration-200 ${
                                openImplementGroup === nombre ? "rotate-180" : ""
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
                    {openImplementGroup === nombre && (
                        <div className="p-4">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="text-left px-4 py-2 border border-gray-300 text-black">
                                            Nombre
                                        </th>
                                        <th className="text-left px-4 py-2 border border-gray-300 text-black">
                                            Estado
                                        </th>
                                        <th className="text-left px-4 py-2 border border-gray-300 text-black">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {implementosGrupo.map((implemento) => (
                                        <tr key={implemento._id} className="border-b border-gray-200 text-black">
                                            <td className="px-4 py-2 text-black">{nombre}</td>
                                            <td className="px-4 py-2 text-black">{implemento.estado}</td>
                                              <td className="px-4 py-2 text-black">
                                                <button
                                                  onClick={() => handleEdit(implemento)}
                                                  className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
                                                  >
                                                  Editar
                                                </button>
                                                <button
                                                  onClick={() => handleDelete(implemento._id)}
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
        </div>
    );
};

export default VerImplementos;