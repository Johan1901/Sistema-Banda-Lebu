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
  const isAdmin = user?.roles?.some(role => role.name === 'admin');

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
        <div className="min-h-screen bg-white bg-opacity-100">
          <div className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center">
                  <h1 className="text-3xl font-bold">Sistema Banda Instrumental de Lebu</h1>
              </div>
              <button
                  onClick={handleLogout}
                  className="bg-gold-500 text-white py-2 px-4 rounded hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-opacity-75 transition-colors duration-200"
              >
              Cerrar sesión
              </button>
          </div>

          <div className="flex">
              {/* Sidebar */}
              <div className="min-w-60 bg-blue-700 text-white flex flex-col fixed transform -translate-x-full md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg">
                  <nav className="flex-grow p-4">
                      <ul>
                          <li>
                              <a href="/" className="block py-2.5 px-4 rounded hover:bg-blue-800 transition-colors duration-200">Inicio</a>
                          </li>

                          {/* Actividades */}
                          <li>
                            <div className="relative">
                              <a
                                  href="#"
                                  onClick={toggleActivities}
                                  className="block py-2.5 px-4 rounded hover:bg-blue-800 cursor-pointer transition-colors duration-200 flex items-center justify-between"
                                >
                                  Actividades
                                  <svg className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${isActivitiesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              </a>
                              {isActivitiesOpen && (
                              <ul className="pl-4 mt-1">
                                  <li>
                                  <a href="/actividades/ver" className="block py-2.5 px-4 rounded hover:bg-blue-600 transition-colors duration-200">Ver actividades</a>
                                  </li>
                                  {isAdmin && (
                                  <li>
                                      <a href="/actividades/crear" className="block py-2.5 px-4 rounded hover:bg-blue-600 transition-colors duration-200">Crear actividad</a>
                                  </li>
                                  )}
                              </ul>
                              )}
                            </div>
                          </li>


                          {/* Integrantes */}
                          <li>
                            <div className="relative">
                              <a
                                  href="#"
                                  onClick={toggleMembers}
                                  className="block py-2.5 px-4 rounded hover:bg-blue-800 cursor-pointer transition-colors duration-200 flex items-center justify-between"
                                >
                                  Integrantes
                                  <svg className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${isMembersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>

                              </a>
                              {isMembersOpen && (
                              <ul className="pl-4 mt-1">
                                  <li>
                                  <a href="/users/ver" className="block py-2.5 px-4 rounded hover:bg-blue-600 transition-colors duration-200">Ver integrantes</a>
                                  </li>
                                  {isAdmin && (
                                  <li>
                                      <a href="/users/crear" className="block py-2.5 px-4 rounded hover:bg-blue-600 transition-colors duration-200">Crear integrante</a>
                                  </li>
                                  )}
                              </ul>
                              )}
                            </div>
                          </li>


                          {/* Inventario (solo para admin) */}
                          {isAdmin && (
                            <li>
                              <div className="relative">
                                  <a
                                  href="#"
                                  onClick={toggleInventory}
                                  className="block py-2.5 px-4 rounded hover:bg-blue-800 cursor-pointer transition-colors duration-200 flex items-center justify-between"
                                  >
                                      Inventario
                                      <svg className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${isInventoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                  </a>
                                  {isInventoryOpen && (
                                  <ul className="pl-4 mt-1">
                                      <li>
                                      <a href="/inventario/ver/instrumentos" className="block py-2.5 px-4 rounded hover:bg-blue-600 transition-colors duration-200">Ver instrumentos</a>
                                      </li>
                                      <li>
                                      <a href="/inventario/ver/implementos" className="block py-2.5 px-4 rounded hover:bg-blue-600 transition-colors duration-200">Ver implementos</a>
                                      </li>
                                  </ul>
                                  )}
                              </div>
                              </li>
                          )}
                      </ul>
                  </nav>
              </div>

              {/* Main content */}
              <div className="ml-0 md:ml-100 flex-grow p-6">
                  <Outlet />
              </div>
          </div>
        </div>
          );
}

export default Root;