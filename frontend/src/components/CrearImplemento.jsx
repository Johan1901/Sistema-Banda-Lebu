import React, { useState, useRef, useEffect } from "react";
import { createImplemento } from "../services/implemento.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";
import { useNavigate } from "react-router-dom";

const CrearImplemento = () => {
    const navigate = useNavigate();
    const [implemento, setImplemento] = useState({
        nombre: "",
        estado: "",
    });

    const [showNombreOptions, setShowNombreOptions] = useState(false);
    const nombresImplementos = ["atril", "baquetas", "correa de bombo", "correa de redoble", "maceta"];

    const handleChange = (e) => {
        setImplemento({
            ...implemento,
            [e.target.name]: e.target.value,
        });
    };

    const handleNombreClick = () => {
        setShowNombreOptions(!showNombreOptions);
    };

    const handleOptionClick = (value) => {
      setShowNombreOptions(false);
      setImplemento((prevImplemento) => ({
        ...prevImplemento,
        nombre: value,
      }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createImplemento(implemento);
            showSuccessAlert("Implemento creado correctamente");
             setImplemento({
                nombre: "",
                estado: "",
            });
             navigate("/inventario/ver/implementos"); // Redirect after success
        } catch (error) {
            showErrorAlert("Error al crear implemento");
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded shadow-md">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Crear Implemento</h1>
            <div className="flex justify-end mb-4">
            <button
                onClick={() => navigate("/inventario/ver/implementos")}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded"
            >
                Volver
            </button>
            </div>
           <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">

                <div className="relative">
                    <label
                        htmlFor="nombre"
                        className="block text-lg font-medium text-gray-700 mb-1 text-left" // Align label left
                    >
                        Nombre
                    </label>
                    <input
                        id="nombre"
                        name="nombre"
                        value={implemento.nombre}
                        onChange={handleChange}
                        type="text"
                        onClick={handleNombreClick}
                        placeholder="Selecciona un nombre"
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:border-blue-500"
                    />
                    {showNombreOptions && (
                        <ul className="absolute left-0 z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg"
                            style={{ maxHeight: '150px', overflowY: 'auto' }}
                        >
                          {nombresImplementos.map((nombre) => (
                            <li
                              key={nombre}
                              onClick={() => handleOptionClick(nombre)}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              style={{ backgroundColor: '#f9f9f9', fontWeight: '500', color: '#333' }}
                            >
                              {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
                            </li>
                          ))}
                         </ul>
                    )}
                </div>
               <div className="flex flex-col">
                <label className="text-lg font-medium text-gray-700 mb-1 text-left" htmlFor="estado">Estado</label>
                <select
                    name="estado"
                    value={implemento.estado}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full bg-white text-gray-800 focus:outline-none focus:border-blue-500"
                >
                    <option value="">Selecciona un estado</option>
                    {["buen estado", "utilizable", "mal estado", "en reparacion"].map((estado) => (
                        <option key={estado} value={estado}>
                            {estado.charAt(0).toUpperCase() + estado.slice(1)}
                        </option>
                    ))}
                </select>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Crear implemento
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default CrearImplemento;