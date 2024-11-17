import React, { useState } from "react";
import { toast} from "react-toastify";
import { createInstrumento } from "../services/instrumento.service";



const CrearInstrumento = () => {
    const [instrumento, setInstrumento] = useState({
        nombre: "",
        marca: "",
        estado: "",
        implemento: "",
    });
    
    const handleChange = (e) => {
        setInstrumento({
        ...instrumento,
        [e.target.name]: e.target.value,
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await createInstrumento(instrumento);
        toast.success("Instrumento creado correctamente");
        } catch (error) {
        toast.error("Error al crear instrumento");
        }
    };
    
    return (
        <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mt-8">Crear Instrumento</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-600">
                Nombre
            </label>
            <input
                id="nombre"
                type="text"
                name="nombre"
                value={instrumento.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
            />
            </div>
            <div>
            <label htmlFor="marca" className="block text-sm font-medium text-gray-600">
                Marca
            </label>
            <input
                id="marca"
                type="text"
                name="marca"
                value={instrumento.marca}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Marca"
            />
            </div>
            <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-600">
                estado
            </label>
            <input
                id="estado"
                type="text"
                name="estado"
                value={instrumento.estado}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"  
                placeholder="estado"
            />
            </div>
            <div>
            <label htmlFor="implemento" className="block text-sm font-medium text-gray-600">
                Implemento  
            </label>
            <input
                id="implemento"
                type="text"
                name="implemento"
                value={instrumento.implemento}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Implemento"
            />
            </div>
            <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
            >
            Crear Instrumento
            </button>
        </form>
        </div>
    );
}

export default CrearInstrumento;
