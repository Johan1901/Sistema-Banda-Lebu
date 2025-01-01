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
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mt-8">Crear Integrante</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600"
          >
            Nombre y apellido
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
          <label
            htmlFor="rut"
            className="block text-sm font-medium text-gray-600"
          >
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
          <label
            htmlFor="fecha_nacimiento"
            className="block text-sm font-medium text-gray-600"
          >
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
          <label
            htmlFor="telefono"
            className="block text-sm font-medium text-gray-600"
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
              className="w-full border border-gray-300 rounded-r-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12345678"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600"
          >
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
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
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
        <div className="relative">
          <label
            htmlFor="instrumento"
            className="block text-sm font-medium text-gray-600"
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
            className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showOptions && (
            <ul className="absolute left-0 z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg"
                style={{ maxHeight: '150px', overflowY: 'auto' }}  // Added styles here
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
            className="block text-sm font-medium text-gray-600"
          >
            Roles
          </label>
          <select
            id="roles"
            name="roles"
            value={integrante.roles}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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