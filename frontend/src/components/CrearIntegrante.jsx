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
        roles: "",
    });
    const [showOptions, setShowOptions] = useState(false);

    const instrumentos = ["trompeta", "trombon", "baritono", "tuba", "redoble", "platillos", "lira", "clarinete", "saxofon", "bombo", "flautin", "corno"];
    const rolesList = ["user", "admin"];

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'instrumento') {
            setIntegrante((prevIntegrante) => ({
                ...prevIntegrante,
                instrumento: value,
            }));
        } else {
            setIntegrante((prevIntegrante) => ({
                ...prevIntegrante,
                [name]: value,
            }));
        }
    };

    const handleRutChange = (e) => {
        let { value } = e.target;
        // Remove non-numeric characters except 'k' or 'K'
        value = value.replace(/[^0-9kK]/g, '');
        // Limit to a maximum of 9 characters
        value = value.slice(0, 9);
        // Insert hyphen after the 8th digit if it exists
        if (value.length > 0 && value.length <= 8) {
          value = value.slice(0,8)
        }
         if (value.length > 8) {
           value = value.slice(0,8) + "-" + value.slice(8, 9)
         }


        setIntegrante((prevIntegrante) => ({
            ...prevIntegrante,
            rut: value,
        }));
    };


    const handleTelefonoChange = (e) => {
        const { value } = e.target;
        const telefonoLimpio = value.replace(/\D/g, "").slice(0, 8);
        setIntegrante((prevIntegrante) => ({
            ...prevIntegrante,
            telefono: telefonoLimpio,
        }));
    };

    const handleInstrumentClick = () => {
        setShowOptions(!showOptions);
    };

    const handleOptionClick = (value) => {
        setShowOptions(false);
        setIntegrante((prevIntegrante) => ({
            ...prevIntegrante,
            instrumento: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!integrante.roles) {
                showErrorAlert("Por favor, seleccione un rol.");
                return;
            }

            const dataToSend = {
                ...integrante,
                telefono: `+569${integrante.telefono}`,
                roles: [integrante.roles],
            };

            console.log("Datos a enviar:", dataToSend);

            await createIntegrante(dataToSend);
            showSuccessAlert("Integrante creado correctamente");

            setIntegrante({
                username: "",
                rut: "",
                fecha_nacimiento: "",
                telefono: "",
                password: "",
                email: "",
                instrumento: "",
                roles: "",
            });
        } catch (error) {
            showErrorAlert("Error al crear integrante");
            console.error("Error al crear integrante:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded shadow-md">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Crear Integrante</h1>
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
                            Nombre y apellido
                        </label>
                        <input
                            id="username"
                            name="username"
                            value={integrante.username}
                            onChange={handleChange}
                            type="text"
                            placeholder="Ingrese el nombre y apellido"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="rut"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
                            Rut
                        </label>
                         <input
                            id="rut"
                            name="rut"
                            value={integrante.rut}
                            onChange={handleRutChange}
                            type="text"
                            placeholder="Ingrese el rut"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="fecha_nacimiento"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
                            Fecha de nacimiento
                        </label>
                        <input
                            id="fecha_nacimiento"
                            name="fecha_nacimiento"
                            value={integrante.fecha_nacimiento}
                            onChange={handleChange}
                            type="date"
                             placeholder="Seleccione la fecha de nacimiento"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ backgroundColor: 'white' }}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="telefono"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
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
                                 placeholder="Ingrese el número de teléfono"
                                className="w-full border border-gray-300 rounded-r-md py-2 px-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            value={integrante.password}
                            onChange={handleChange}
                            type="password"
                             placeholder="Ingrese la contraseña"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            value={integrante.email}
                            onChange={handleChange}
                            type="email"
                             placeholder="Ingrese el correo electrónico"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <label
                            htmlFor="instrumento"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
                            Instrumento
                        </label>
                        <input
                            id="instrumento"
                            name="instrumento"
                            value={integrante.instrumento}
                            onChange={handleChange}
                            type="text"
                            onClick={handleInstrumentClick}
                             placeholder="Seleccione un instrumento"
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showOptions && (
                            <ul className="absolute left-0 z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg"
                                style={{ maxHeight: '150px', overflowY: 'auto' }}
                            >
                                {instrumentos.map((instrumento) => (
                                    <li
                                        key={instrumento}
                                        onClick={() => handleOptionClick(instrumento)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        style={{ backgroundColor: '#f9f9f9', fontWeight: '500', color: '#333' }}
                                    >
                                        {instrumento.charAt(0).toUpperCase() + instrumento.slice(1)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="roles"
                            className="block text-lg font-medium text-gray-700 mb-1 text-left"
                        >
                            Roles
                        </label>
                        <select
                            id="roles"
                            name="roles"
                            value={integrante.roles}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ maxHeight: '150px', overflowY: 'auto' }}
                        >
                            <option value="">Selecciona un rol</option>
                            {rolesList.map((roles) => (
                                <option key={roles} value={roles} style={{ fontWeight: '500' }}>
                                    {roles.charAt(0).toUpperCase() + roles.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Crear Integrante
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearIntegrante;