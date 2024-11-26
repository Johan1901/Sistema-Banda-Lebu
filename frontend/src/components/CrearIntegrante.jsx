import React, { useState } from "react";
import { createIntegrante } from "../services/integrantes.service.js";
import { showSuccessAlert, showErrorAlert } from "./Alertmsg.jsx";

const CrearIntegrante = () => {
    const [integrante, setIntegrante] = useState({
        username: "",
        rut: "",
        fecha_nacimiento: "",
        telefono: "",
        password: "",
        email: "",
        instrumento: "",
        roles: "",  // Agregar campo roles
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setIntegrante((prevIntegrante) => ({
            ...prevIntegrante,
            [name]: value,
        }));
    };

    const handleTelefonoChange = (e) => {
        const { value } = e.target;
        // Solo permitir números y limitar a 8 caracteres
        const telefonoLimpio = value.replace(/\D/g, "").slice(0, 8);
        setIntegrante((prevIntegrante) => ({
            ...prevIntegrante,
            telefono: telefonoLimpio,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (!integrante.roles) {
                showErrorAlert("Por favor, seleccione un roles.");
                return;
            }
    
            const dataToSend = {
                ...integrante,
                telefono: `+569${integrante.telefono}`,
                roles: [integrante.roles], // Aseguramos que roles sea un array
            };
    
            console.log("Datos a enviar:", dataToSend);  // Agregado para depuración
    
            await createIntegrante(dataToSend);
            showSuccessAlert("Integrante creado correctamente");
    
            // Limpiar los campos del formulario
            setIntegrante({
                username: "",
                rut: "",
                fecha_nacimiento: "",
                telefono: "",
                password: "",
                email: "",
                instrumento: "",
                roles: "", // Limpiar el campo roles
            });
        } catch (error) {
            showErrorAlert("Error al crear integrante");
            console.error("Error al crear integrante:", error); // Para depuración
        }
    };
    

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-center mt-8">Crear Integrante</h1>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                        Nombre de usuario
                    </label>
                    <input
                        id="username"
                        name="username"
                        value={integrante.username}
                        onChange={handleChange}
                        type="text"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="rut" className="block text-sm font-medium text-gray-600">
                        Rut
                    </label>
                    <input
                        id="rut"
                        name="rut"
                        value={integrante.rut}
                        onChange={handleChange}
                        type="text"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-600">
                        Fecha de nacimiento
                    </label>
                    <input
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        value={integrante.fecha_nacimiento}
                        onChange={handleChange}
                        type="date"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-600">
                        Teléfono
                    </label>
                    <div className="flex items-center">
                        <span className="py-2 px-3 bg-gray-200 text-gray-700 rounded-l-md border border-gray-300">
                            +569
                        </span>
                        <input
                            id="telefono"
                            name="telefono"
                            value={integrante.telefono}
                            onChange={handleTelefonoChange}
                            type="text"
                            className="w-full border border-gray-300 rounded-r-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="12345678"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        name="password"
                        value={integrante.password}
                        onChange={handleChange}
                        type="password"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        value={integrante.email}
                        onChange={handleChange}
                        type="email"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="instrumento" className="block text-sm font-medium text-gray-600">
                        Instrumento
                    </label>
                    <select
                        id="instrumento"
                        name="instrumento"
                        value={integrante.instrumento}
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
                {/* Campo roles */}
                <div>
                    <label htmlFor="roles" className="block text-sm font-medium text-gray-600">
                        Roles
                    </label>
                    <select
                        id="roles"
                        name="roles"
                        value={integrante.roles}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona un roles</option>
                        {["user", "admin"].map((roles) => (
                            <option key={roles} value={roles}>
                                {roles.charAt(0).toUpperCase() + roles.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Crear Integrante
                </button>
            </form>
        </div>
    );
};

export default CrearIntegrante;
