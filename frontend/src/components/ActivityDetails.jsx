import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getActividad,
    confirmarParticipacion,
    confirmarParticipacionesAdmin,
} from "../services/actividades.service";
import { useAuth } from "../context/AuthContext";
import { showErrorAlert, showSuccessAlert } from "./Alertmsg";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

const ActivityDetails = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.roles?.some((role) => role.name === "admin");
    const isUser = user?.roles?.some((role) => role.name === "user");
    const [participante, setParticipante] = useState(null);
    const [userParticipantData, setUserParticipantData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchActivityDetails = useCallback(async () => {
        setLoading(true);
        try {
            console.log("Fetching activity details for ID:", id);
            const response = await getActividad(id);
            console.log("Response from getActividad:", response);
            if (response.data) {
                setActivity(response.data);
                if (response.data.participantes) {
                  findUserParticipant(response.data.participantes);
                }
            } else {
                console.log("Unexpected format in server response.");
                setError("Formato inesperado en la respuesta del servidor.");
            }
        } catch (error) {
            console.error("Error fetching activity details:", error);
            setError(
                error?.message || "No se pudo cargar los detalles de la actividad."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchActivityDetails();
    }, [fetchActivityDetails, id]);

    const findUserParticipant = (participantes) => {
         const existingParticipant = participantes?.find(
              (p) => p?.integrante?._id === user._id
          );
  
        console.log("Participante encontrado para el usuario logueado:", existingParticipant);
          setParticipante(existingParticipant || null);
  
           if (existingParticipant) {
              setUserParticipantData(existingParticipant);
         } else {
             setUserParticipantData({
                 integrante: {
                     _id: user._id,
                       email: user.email,
                       username: user?.username || "Usuario",
                   },
                  estado: "pendiente",
              });
              console.log("Datos del usuario inicializados para 'pendiente':", {
                   integrante: {
                      _id: user._id,
                        email: user.email,
                        username: user?.username || "Usuario",
                     },
                    estado: "pendiente",
              });
          }
   };

    const getParticipantStatusIcon = (status) => {
        switch (status) {
            case "confirmado":
                return <CheckIcon className="h-8 w-10 text-green-500 mx-auto" />;
            case "no participa":
                return <XMarkIcon className="h-8 w-10 text-red-500 mx-auto" />;
            default:
                return <span className="mx-auto">Pendiente</span>;
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages =
        Math.ceil(activity?.participantes?.length / itemsPerPage) || 0;
    const currentParticipantes =
        activity?.participantes?.slice(indexOfFirstItem, indexOfLastItem) || [];
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleConfirmarAsistenciaAdmin = async (participanteId, estado) => {
        try {
            const participacionValue =
                estado === "no participa" ? "no participa" : "confirmado";
            const justificacionValue =
                estado === "no participa"
                    ? "cancelada por admin"
                    : "confirmada por admin";
            console.log("Confirming admin participation:", {
                id,
                participanteId,
                participacionValue,
                justificacionValue,
            });
            const response = await confirmarParticipacionesAdmin(
                id,
                participanteId,
                participacionValue,
                justificacionValue
            );
            console.log("Response from confirmarParticipacionesAdmin:", response);
             if (response && response.participantes) {
                setActivity((prevActivity) => ({
                  ...prevActivity,
                  participantes: response.participantes,
              }));
              console.log(
                "Activity updated with new participants:",
                response.participantes
            );
        }
            showSuccessAlert(
                `Participación ${
                    estado === "no participa" ? "cancelada" : "confirmada"
                } por el admin`
            );
            fetchActivityDetails(); // Refetch after admin confirmation
        } catch (error) {
            console.error("Error al confirmar participaciones admin:", error);
            showErrorAlert(
                error?.message || "Error al confirmar participaciones admin"
            );
        }
    };

    //In ActivityDetails.js
    const handleConfirmarMiAsistencia = async (estado) => {
        try {
          const participacionValue = estado === "no participa" ? "no participa" : "confirmado";
          const justificacionValue = estado === "no participa" ? "cancelada por usuario" : "confirmada por usuario";
  
          // Find the participant document to get the ID
          const participantData = activity.participantes.find(p => p.integrante.email === user.email);
          console.log("Datos del participante encontrado:", participantData);
          if (!participantData) {
            showErrorAlert("No se encontró la participación del usuario.");
            return;
          }
          console.log("id del integrante que esta participando", participantData.integrante._id); // This is the correct ID
          const participanteId = participantData.integrante._id; // This is the correct ID
  
          console.log("Confirming user participation:", { id, participanteId, participacionValue, justificacionValue });
  
          const response = await confirmarParticipacion(id, participanteId, participacionValue, justificacionValue);
  
          console.log("Respuesta de confirmarParticipacion:", response);
           if (response && response.participantes) {
              setActivity((prevActivity) => ({
                  ...prevActivity,
                  participantes: response.participantes,
              }));
              console.log("Actividad actualizada con nuevos participantes:", response.participantes);
            }
            showSuccessAlert(
              `Participación ${estado === "no participa" ? "cancelada" : "confirmada"}`
            );
            fetchActivityDetails(); // Refetch after user confirmation
          } catch (error) {
            console.error("Error al confirmar asistencia:", error);
            showErrorAlert(error?.message || "Error al confirmar asistencia.");
        }
    };

    if (error) {
        console.log("Error during rendering:", error);
        return <div className="text-red-700 text-center">{error}</div>;
    }
    if (loading) {
        console.log("Activity data is loading");
        return <div className="text-center">Cargando...</div>;
    }
    if (!activity) {
        console.log("No se encontró la actividad");
        return <div className="text-center">No se encontró la actividad.</div>;
    }

    console.log("Rendering activity details:", activity);
    console.log("Current user data:", user);
    console.log("User participant data:", userParticipantData);

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold text-center mb-6">{activity.titulo}</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-800 text-sm mb-4">{activity.descripcion}</p>
                <div className="mb-2">
                    <strong className="text-gray-800">Fecha:</strong>{" "}
                    <span className="text-gray-800">
                        {new Date(activity.fecha).toISOString().split("T")[0]}
                    </span>
                </div>
                <div className="mb-2">
                    <strong className="text-gray-800">Hora:</strong>{" "}
                    <span className="text-gray-800">{activity.hora}</span>
                </div>
                <div className="mb-2">
                    <strong className="text-gray-800">Lugar:</strong>{" "}
                    <span className="text-gray-800">{activity.lugar}</span>
                </div>
                {isUser && (
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                            Mi participación
                        </h2>
                        {user && activity?.participantes ? (
                            activity.participantes
                                .filter((p) => p?.integrante?.email === user.email)
                                .map((participantData) => (
                                    <div
                                        key={participantData?.integrante?._id || Math.random()}
                                        className="flex justify-between items-center mb-2  bg-white border-b dark:bg-gray-100 dark:border-gray-800"
                                    >
                                        <div className="px-4 py-2 whitespace-nowrap">
                                            <strong className="text-gray-800">
                                                {participantData?.integrante?.username}
                                            </strong>
                                        </div>
                                        <div className="px-4 py-2 text-center">
                                            {getParticipantStatusIcon(participantData?.estado)}
                                        </div>
                                       <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleConfirmarMiAsistencia("confirmado")
                                                }
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                                            >
                                                Confirmar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleConfirmarMiAsistencia("no participa")
                                                }
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                                            >
                                                No Participa
                                            </button>
                                        </div>
                                    </div>
                                ))
                        ) : user ? (
                            <div className="flex justify-between items-center mb-2  bg-white border-b dark:bg-gray-100 dark:border-gray-800">
                                <div className="px-4 py-2 whitespace-nowrap">
                                    <strong className="text-gray-800">
                                        {user?.username}
                                    </strong>
                                </div>
                                <div className="px-4 py-2 text-center">
                                        {getParticipantStatusIcon("pendiente")}
                                </div>
                                <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleConfirmarMiAsistencia("confirmado")
                                                }
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                                            >
                                                Confirmar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleConfirmarMiAsistencia("no participa")
                                                }
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                                            >
                                                No Participa
                                            </button>
                                        </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                Debes iniciar sesión para ver tu participación.
                            </div>
                        )}
                    </div>
                )}
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                    Participantes
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
                                    <td className="px-4 py-2 text-center">
                                        {index + 1 + (currentPage - 1) * itemsPerPage}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {participante?.integrante?.username}
                                    </td>
                                    <td className={`px-4 py-2 text-center`}>
                                        {getParticipantStatusIcon(participante?.estado)}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {isAdmin && (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleConfirmarAsistenciaAdmin(
                                                            participante.integrante._id,
                                                            "confirmado"
                                                        )
                                                    }
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded"
                                                >
                                                    Confirmar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleConfirmarAsistenciaAdmin(
                                                            participante.integrante._id,
                                                            "no participa"
                                                        )
                                                    }
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
                                className={`mx-1 px-3 py-1 rounded text-sm ${currentPage === page
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
                        onClick={() => navigate("/actividades/ver")}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded"
                    >
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetails;