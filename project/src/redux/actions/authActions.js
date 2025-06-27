import axios from 'axios';
import { LOGIN_SUCCESS, LOGOUT, REGISTER_SUCCESS } from '../actionTypes.js';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Login user
export const login = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data
    });
    
    toast.success('Login successful!');
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    toast.error(error.response?.data?.message || 'Login failed');
    throw error;
  }
};

// Register user
export const register = (userData) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    
    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data
    });
    
    toast.success('Registration successful!');
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    toast.error(error.response?.data?.message || 'Registration failed');
    throw error;
  }
};

// Logout user
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  toast.success('Logged out successfully!');
};