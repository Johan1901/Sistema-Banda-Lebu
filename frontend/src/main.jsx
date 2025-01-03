import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './routes/App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Login from './routes/Login.jsx';
import CrearInstrumento from './components/CrearInstrumento.jsx';
import VerInstrumentos from './components/VerInstrumentos.jsx';
import CrearActividad from './components/CrearActividad.jsx';
import VerActividades from './components/VerActividades.jsx';
import CrearIntegrante from './components/CrearIntegrante.jsx';
import VerIntegrantes from './components/VerIntegrantes.jsx';
import ActivityDetails from './components/ActivityDetails.jsx';
import CrearImplemento from './components/CrearImplemento.jsx';
import VerImplementos from './components/VerImplementos.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      //nueva ruta para CrearInstrumento
      {
        path: '/inventario/crear/instrumento',
        element: <CrearInstrumento />,
      },
      //nueva ruta para VerInstrumentos
      {
        path: '/inventario/ver/instrumentos',
        element: <VerInstrumentos />,
      },
      //nueva ruta para CearActividad
      {
        path: '/actividades/crear',
        element: <CrearActividad />,
      },
      //nueva ruta para VerActividades
      {
        path: '/actividades/ver',
        element: <VerActividades />,
      },
      //nueva ruta para CrearIntegrante
      {
        path: '/users/crear',
        element: <CrearIntegrante />,
      },
      //nueva ruta para VerIntegrantes
      {
        path: '/users/ver',
        element: <VerIntegrantes />,
      },
      //nueva ruta para ActivityDetails
      {
        path: '/actividades/:id',
        element: <ActivityDetails />,
      },
      //nueva ruta para CrearImplemento
      {
        path: '/inventario/crear/implemento',
        element: <CrearImplemento />,
      },
      //nueva ruta para VerImplementos
      {
        path: '/inventario/ver/implementos',
        element: <VerImplementos />,
      },

    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
