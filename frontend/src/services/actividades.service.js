import axios from "axios";

//const API_URL = `${import.meta.env.VITE_BASE_URL}/api/actividades`;
const API_URL = `http://localhost:3000/api/actividades`;

const getToken = () => sessionStorage.getItem("token");

export const createActividad = async (actividad) => {
    try {
        const token = getToken();
        if (!token) {
        throw new Error("No hay un token de autenticación");
        }
        const response = await axios.post(API_URL, actividad, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        return response;
    } catch (error) {
        console.error("Error al crear actividad:", error);
        throw new Error(error);
    }
};

export const getActividades = async () => {
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
        console.error("Error al obtener actividades:", error);
        throw new Error(error);
    }
};

export const getActividad = async (id) => {
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

export const updateActividad = async (id, actividad) => {
    try {
        const token = getToken();
        if (!token) {
        throw new Error("No hay un token de autenticación");
        }

        const response = await axios.put(`${API_URL}/${id}`, actividad, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        return response;
    } catch (error) {
        console.error("Error al actualizar actividad:", error);
        throw new Error(error);
    }
};

export const deleteActividad = async (id) => {
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
        return response.data;
    } catch (error) {
        throw error.response.data
    }
};
