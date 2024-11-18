import React, { useState } from "react";
import { toast } from "react-toastify";
import { createInstrumento } from "../services/instrumento.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";

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
            showSuccessAlert("Instrumento creado correctamente");
            // Limpiar los campos del formulario
            setInstrumento({
                nombre: "",
                marca: "",
                estado: "",
                implemento: "",
            });
        } catch (error) {
            showErrorAlert("Error al crear instrumento");
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
            <select
                id="nombre"
                name="nombre"
                value={instrumento.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Selecciona un instrumento</option>
                {["trompeta", "trombon", "baritono", "tuba", "redoble", "platillos", "lira", "clarinete", "saxofon", "bombo"].map((instrumento) => (
                    <option key={instrumento} value={instrumento}>
                        {instrumento.charAt(0).toUpperCase() + instrumento.slice(1)}
                    </option>
                ))}
            </select>
        </div>
        <div>
            <label htmlFor="marca" className="block text-sm font-medium text-gray-600">
                Marca
            </label>
            <select
                id="marca"
                name="marca"
                value={instrumento.marca}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Selecciona una marca</option>
                {["yamaha", "conn", "jupiter", "baldassare", "vicent bach", "etinger"].map((marca) => (
                    <option key={marca} value={marca}>
                        {marca.charAt(0).toUpperCase() + marca.slice(1)}
                    </option>
                ))}
            </select>
        </div>
        <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-600">
                Estado
            </label>
            <select
                id="estado"
                name="estado"
                value={instrumento.estado}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Selecciona un estado</option>
                {["buen estado", "utilizable", "mal estado", "en reparacion"].map((estado) => (
                    <option key={estado} value={estado}>
                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </option>
                ))}
            </select>
        </div>
        <div>
            <label htmlFor="implemento" className="block text-sm font-medium text-gray-600">
                Implemento (opcional)
            </label>
            <select
                id="implemento"
                name="implemento"
                value={instrumento.implemento}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Selecciona un implemento</option>
                {["atril", "baquetas", "correa de bombo", "correa de redoble", "maceta", "ninguno"].map((implemento) => (
                    <option key={implemento} value={implemento}>
                        {implemento.charAt(0).toUpperCase() + implemento.slice(1)}
                    </option>
                ))}
            </select>
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
};

export default CrearInstrumento;
