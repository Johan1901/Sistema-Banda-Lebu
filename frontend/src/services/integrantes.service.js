import axios from "axios";

//const API_URL = `${import.meta.env.VITE_BASE_URL}/api/users`;
const API_URL = `http://localhost:3000/api/users`;

const getToken = () => sessionStorage.getItem("token");

export const createIntegrante = async (integrante) => {
    try {
        const token = getToken();
        if (!token) {
        throw new Error("No hay un token de autenticación");
        }
        const response = await axios.post(API_URL, integrante, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        return response;
    } catch (error) {
        console.error("Error al crear integrante:", error);
        throw new Error(error);
    }
};

export const getIntegrantes = async () => {
    try {
        const token = getToken();
        if (!token) {
        throw new Error("No hay un token de autenticación");
        }
        const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });

        return response;
    } catch (error) {
        console.error("Error al obtener integrantes:", error);
        throw new Error(error);
    }
};

export const getIntegrante = async (id) => {
    try {
        const token = getToken();
        if (!token) {
        throw new Error("No hay un token de autenticación");
        }

        const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateIntegrante = async (id, integrante) => {
    try {
        const token = getToken();
        if (!token) {
        throw new Error("No hay un token de autenticación");
        }
        const response = await axios.put(`${API_URL}/${id}`, integrante, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        return response;
    } catch (error) {
        console.error("Error al actualizar integrante:", error);
        throw new Error(error);
    }
};

export const deleteIntegrante = async (id) => {
    try {
        const token = getToken();
        if (!token) {
        throw new Error("No hay un token de autenticación");
        }
        const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        return response;
    } catch (error) {
        console.error("Error al eliminar integrante:", error);
        throw new Error(error);
    }
};
