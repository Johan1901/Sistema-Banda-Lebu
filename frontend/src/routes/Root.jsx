import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth.service';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useState } from 'react';

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.roles?.some(role => role.name === 'admin'); // Manejo opcional de usuario no logueado

  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const toggleActivities = () => {
    setIsActivitiesOpen(!isActivitiesOpen);
  };

  const toggleMembers = () => {
    setIsMembersOpen(!isMembersOpen);
  };

  const toggleInventory = () => {
    setIsInventoryOpen(!isInventoryOpen);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sistema Banda Instrumental de Lebu</h1>
        <button
          onClick={handleLogout}
          className="bg-gold-500 text-white py-2 px-4 rounded hover:bg-gold-600"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="min-w-60 bg-blue-700 text-white flex flex-col fixed transform -translate-x-full md:relative md:translate-x-0 transition-transform duration-200 ease-in-out">
          <nav className="flex-grow">
            <ul>
                <li>
                    <a href="/" className="block py-2.5 px-4 rounded hover:bg-blue-800">Inicio</a>
                </li>

                {/* Actividades */}
                <li>
                    <a 
                    href="#"
                    onClick={toggleActivities}
                    className="block py-2.5 px-4 rounded hover:bg-blue-800 cursor-pointer"
                    >
                    Actividades
                    </a>
                    {isActivitiesOpen && (
                    <ul className="pl-4">
                        <li>
                        <a href="/actividades/ver" className="block py-2.5 px-4 rounded hover:bg-blue-600">Ver actividades</a>
                        </li>
                         {isAdmin && (
                        <li>
                            <a href="/actividades/crear" className="block py-2.5 px-4 rounded hover:bg-blue-600">Crear actividad</a>
                        </li>
                        )}
                    </ul>
                    )}
                </li>

                {/* Integrantes */}
                <li>
                    <a 
                    href="#"
                    onClick={toggleMembers}
                    className="block py-2.5 px-4 rounded hover:bg-blue-800 cursor-pointer"
                    >
                    Integrantes
                    </a>
                    {isMembersOpen && (
                    <ul className="pl-4">
                        <li>
                        <a href="/users/ver" className="block py-2.5 px-4 rounded hover:bg-blue-600">Ver integrantes</a>
                        </li>
                        {isAdmin && (
                        <li>
                            <a href="/users/crear" className="block py-2.5 px-4 rounded hover:bg-blue-600">Crear integrante</a>
                        </li>
                        )}
                    </ul>
                    )}
                </li>

                {/* Inventario (solo para admin) */}
                {isAdmin && (
                    <li>
                    <a 
                        href="#"
                        onClick={toggleInventory}
                        className="block py-2.5 px-4 rounded hover:bg-blue-800 cursor-pointer"
                    >
                        Inventario
                    </a>
                    {isInventoryOpen && (
                        <ul className="pl-4">
                        <li>
                            <a href="/inventario/ver/instrumentos" className="block py-2.5 px-4 rounded hover:bg-blue-600">Ver instrumentos</a>
                        </li>
                        <li>
                            <a href="/inventario/ver/implementos" className="block py-2.5 px-4 rounded hover:bg-blue-600">Ver implementos</a>
                        </li>
                        <li>
                            <a href="/inventario/crear/instrumento" className="block py-2.5 px-4 rounded hover:bg-blue-600">Crear instrumento</a>
                        </li>
                        <li>
                            <a href="/inventario/crear/implemento" className="block py-2.5 px-4 rounded hover:bg-blue-600">Crear implemento</a>
                        </li>
                        </ul>
                    )}
                    </li>
                )}
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="ml-60 flex-grow p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Root;