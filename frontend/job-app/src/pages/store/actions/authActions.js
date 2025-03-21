import axios from 'axios';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logoutSuccess,
  registerStart,
  registerSuccess,
  registerFailure,
  clearError 
} from '../slices/authSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    dispatch(loginSuccess(user));
    return user;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    dispatch(loginFailure(message));
    throw error;
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    dispatch(registerSuccess(user));
    return user;
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    dispatch(registerFailure(message));
    throw error;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch(logoutSuccess());
};

export const clearAuthError = () => (dispatch) => {
  dispatch(clearError());
}; 