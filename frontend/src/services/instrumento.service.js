import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/instrumentos`;
//const API_URL = `http://localhost:3000/api/instrumentos`;

const getToken = () => sessionStorage.getItem("token");

export const createInstrumento = async (instrumento) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No hay un token de autenticación");
    }
    const response = await axios.post(API_URL, instrumento, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error("Error al crear instrumento:", error);
    throw new Error(error);
  }
};

export const getInstrumentos = async () => {
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
    console.error("Error al obtener instrumentos:", error);
    throw new Error(error);
  }
};

export const getInstrumento = async (id) => {
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

export const updateInstrumento = async (id, instrumento) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No hay un token de autenticación");
    }
    const response = await axios.put(`${API_URL}/${id}`, instrumento, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    console.error("Error al actualizar instrumento:", error);
    throw new Error(error);
  }
};


export const deleteInstrumento = async (id) => {
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
    throw error.response.data;
  }
};

