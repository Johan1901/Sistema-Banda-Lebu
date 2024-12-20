import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    deleteActividad,
    getActividades,
    updateActividad,
    getActividad,
    confirmarParticipacion,
    confirmarParticipacionesAdmin,
} from "../services/actividades.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";
import { getIntegrantes } from "../services/integrantes.service.js";
import { useAuth } from "../context/AuthContext";

const VerActividades = () => {
    const [actividades, setActividades] = useState([]);
    const [integrantes, setIntegrantes] = useState([]);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalParticipantesVisible, setModalParticipantesVisible] = useState(false);
    const [selectedActividad, setSelectedActividad] = useState(null);
    const [selectedParticipantes, setSelectedParticipantes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const navigate = useNavigate();

    const { user } = useAuth();
    const isAdmin = user?.roles?.some(role => role.name === 'admin');
    const isUser = user?.roles?.some(role => role.name === 'user');

    useEffect(() => {
        fetchActividades();
        fetchIntegrantes();
    }, []);


    const fetchActividades = async () => {
        try {
            const response = await getActividades();
            if (response.data && (Array.isArray(response.data.data) || Array.isArray(response.data))) {
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
        return date.toISOString().split("T")[0];
    };

    const handleViewParticipants = (actividad) => {
        setSelectedParticipantes(actividad.participantes || []);
        setModalParticipantesVisible(true);
        setCurrentPage(1);
        setSelectedActividad(actividad);
    };

    const getParticipantStatusColor = (status) => {
        switch (status) {
            case "confirmado":
                return "bg-green-500";
            case "bajado":
                return "bg-red-500";
            case "no participa":
                return "bg-gray-500";
            default:
                return "bg-gray-300";
        }
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(selectedParticipantes?.length / itemsPerPage) || 0;

    const [currentParticipantes, setCurrentParticipantes] = useState([]);

    useEffect(() => {
        setCurrentParticipantes(selectedParticipantes?.slice(
            indexOfFirstItem,
            indexOfLastItem
        ) || []);
    }, [selectedParticipantes, currentPage]);



    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleConfirmarAsistenciaAdmin = async (actividadId, participanteId, estado) => {
        try {
            const participacionValue = estado === "no participa" ? "no participa" : "confirmado";
            const justificacionValue = estado === "no participa" ? "cancelada por admin" : "confirmada por admin";

            const response = await confirmarParticipacionesAdmin(actividadId, participanteId, participacionValue, justificacionValue);

            if (response && response.participantes) {
                setSelectedParticipantes(response.participantes); //Update participans state
            }
            fetchActividades(); // Refetch all activities
            showSuccessAlert(`Participación ${estado === "no participa" ? "cancelada" : "confirmada"} por el admin`);
        } catch (error) {
            console.error("Error al confirmar participaciones admin:", error);
            showErrorAlert("Error al confirmar participaciones admin");
        }
    };

    const handleConfirmarMiAsistencia = async (actividadId, estado) => {
        try {
            if (!user) {
                showErrorAlert("No tienes sesión activa");
                return;
            }

            const participacionValue = estado === "no participa" ? "no participa" : "confirmado";
            const justificacionValue = estado === "no participa" ? "cancelada por el usuario" : "confirmada por el usuario";

             // Obtenemos el participante de la actividad actual
            const currentActivity = actividades.find((act) => act._id === actividadId);
           // Validamos si la actividad actual existe y tiene participantes
           if (!currentActivity || !currentActivity.participantes) {
                console.error("No se pudo obtener la lista de participantes de la actividad");
                showErrorAlert("Error al confirmar asistencia.");
                return;
            }
             let participanteId = currentActivity.participantes.find(participante => participante?.integrante?._id === user?._id)?.integrante?._id;
             
             if(!participanteId) {
                //Aqui asumimos que el usuario no esta registrado en la actividad, asi que lo creamos
                  const createdParticipant = await confirmarParticipacion(actividadId, user._id, participacionValue, justificacionValue);
                    if(createdParticipant && createdParticipant.participantes) {
                         //Actualizamos el estado de los participantes
                         setSelectedParticipantes(createdParticipant.participantes);
                        participanteId = createdParticipant?.participantes?.find(participante => participante?.integrante?._id === user?._id)?.integrante?._id;
                        if(!participanteId) {
                            showErrorAlert("No se pudo obtener el id del participante creado");
                            return;
                        }
                    }
             }

            const response = await confirmarParticipacion(actividadId, participanteId, participacionValue, justificacionValue);
            if (response && response.participantes) {
                setSelectedParticipantes(response.participantes);  //Update participans state
            }
            fetchActividades(); // Refetch all activities
            showSuccessAlert("Estado Actualizado");
        } catch (error) {
            console.error("Error al confirmar asistencia:", error);
            showErrorAlert("Error al confirmar asistencia");
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-center mt-8">Ver Actividades</h1>
            {isAdmin === true && (
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => navigate("/actividades/crear")}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Crear Actividad
                    </button>
                </div>
            )}
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
                            {isUser && (
                            <div className="flex justify-between gap-2">
                            {actividad?.participantes?.some(participante => participante?.integrante?._id === user?._id) ? (
                                <button
                                    onClick={() => handleConfirmarMiAsistencia(actividad._id, actividad?.participantes?.find(participante => participante?.integrante?._id === user?._id)?.estado === "no participa" ? "confirmado" : "no participa")}
                                    className={`${actividad?.participantes?.find(participante => participante?.integrante?._id === user?._id)?.estado === "no participa" ? "bg-green-500 hover:bg-green-700" : "bg-red-500 hover:bg-red-700"} text-white font-bold py-1 px-4 rounded`}
                                >
                                    {actividad?.participantes?.find(participante => participante?.integrante?._id === user?._id)?.estado === "no participa" ? "Confirmar" : "No Participa"}
                                </button>
                            ) : (
                                <button onClick={() => handleConfirmarMiAsistencia(actividad._id,  "confirmado" )}
                                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded`}
                                >
                                     Confirmar
                                </button>
                            )}
                           </div>
                        )}
                            <div className="flex justify-between gap-2">
                                {isAdmin === true && (
                                    <>
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
                                    </>
                                )}
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

            {modalParticipantesVisible && (
                <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-h-90vh overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-black text-center">
                            Participantes de: {selectedActividad?.titulo}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-gray-500 dark:text-gray-900">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 text-center">N°</th>
                                        <th className="px-4 py-2 text-left">Nombre</th>
                                        <th className="px-4 py-2 text-center">Estado</th>
                                        <th className="px-4 py-2 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentParticipantes.map((participante, index) => (
                                        <tr
                                            key={participante?.integrante?._id || Math.random()}
                                            className="bg-white border-b dark:bg-gray-100 dark:border-gray-800"
                                        >
                                            <td className="px-4 py-2 text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                {participante?.integrante?.username}
                                            </td>
                                            <td className={`px-4 py-2 text-center ${getParticipantStatusColor(participante?.estado)}`}>
                                                {participante?.estado}
                                            </td>
                                             <td className="px-4 py-2 text-center">
                                               {isAdmin && (
                                                   <div className="flex justify-center gap-2">
                                                   <button onClick={() => handleConfirmarAsistenciaAdmin(selectedActividad._id, participante.integrante._id, "confirmado")}
                                                   className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                                                   >
                                                   Confirmar
                                                   </button>
                                                   <button onClick={() => handleConfirmarAsistenciaAdmin(selectedActividad._id, participante.integrante._id, "no participa")}
                                                   className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                                                   >
                                                   No Participa
                                                   </button>
                                                   </div>
                                               )}
                                          </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between mt-4 items-center">
                            <span className="text-sm text-gray-600">
                                Página {currentPage} de {totalPages}
                            </span>
                            <div className="flex">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => paginate(page)}
                                        className={`mx-1 px-3 py-1 rounded text-sm ${
                                            currentPage === page
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
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

            {modalVisible && (
                <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold mb-4 text-black">
                            Editar Actividad
                        </h2>
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