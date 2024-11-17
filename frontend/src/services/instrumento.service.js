import axios from "axios";

//const API_URL = `${import.meta.env.VITE_BASE_URL}/api/instrumentos`;
const API_URL = `http://localhost:3000/api/instrumentos`;
export const createInstrumento = async (instrumento) => {
  try {
    const response = await axios.post(API_URL, instrumento);
    return response;
  } catch (error) {
    console.error("Error al crear instrumento:", error);
    throw new Error(error);
  }
};

export const getInstrumentos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response;
  } catch (error) {
    console.error("Error al obtener instrumentos:", error);
    throw new Error(error);
  }
};

export const getInstrumento = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    console.error("Error al obtener instrumento:", error);
    throw new Error(error);
  }
};

export const updateInstrumento = async (id, instrumento) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, instrumento);
    return response;
  } catch (error) {
    console.error("Error al actualizar instrumento:", error);
    throw new Error(error);
  }
};


export const deleteInstrumento = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    console.error("Error al eliminar instrumento:", error);
    throw new Error(error);
  }
};

