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


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />,
      },
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
