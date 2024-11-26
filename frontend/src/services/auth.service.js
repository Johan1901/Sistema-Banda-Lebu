import axios from './root.service';
import cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/auth/login`;
//const API_URL = 'http://localhost:3000/api/auth/login';
export const login = async ({ email, password }) => {
  try {
    const response = await axios.post( API_URL , {
      email,
      password,
    });
    const { status, data } = response;
    if (status === 200) {
      const decodedToken = jwtDecode(data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(decodedToken));
      sessionStorage.setItem('token', data.data.accessToken);
      sessionStorage.setItem('userId', decodedToken.userId);

      axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
    }
    return response;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw new Error(error);
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
  cookies.remove('jwt');
  sessionStorage.removeItem('token');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};