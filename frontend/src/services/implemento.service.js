import axios from "axios";

//const API_URL = `${import.meta.env.VITE_BASE_URL}/api/implementos`;
const API_URL = "http://localhost:3000/api/implementos";

const getToken = () => sessionStorage.getItem("token");

export const createImplemento = async (implemento) => {
    try {
        const token = getToken();
        if (!token) {
        throw new Error("No hay un token de autenticación");
        }
        const response = await axios.post(API_URL, implemento, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        return response;
    } catch (error) {
        console.error("Error al crear implemento:", error);
        throw new Error(error);
    }
}

export const getImplementos = async () => {
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
        console.error("Error al obtener implementos:", error);
        throw new Error(error);
    }
}

export const getImplemento = async (id) => {
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
}


export const updateImplemento = async (id, implemento) => {
    try {
        const token = getToken();
        if (!token) {
        throw new Error("No hay un token de autenticación");
        }

        const response = await axios.put(`${API_URL}/${id}`, implemento, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });
        return response;
    } catch (error) {
        console.error("Error al actualizar implemento:", error);
        throw new Error(error);
    }
}


export const deleteImplemento = async (id) => {
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
        console.error("Error al eliminar implemento:", error);
        throw new Error(error);
    }
}