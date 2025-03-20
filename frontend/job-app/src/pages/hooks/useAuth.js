import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from '../store/slices/authSlice';
import axios from 'axios';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error, userRole } = useSelector(
    (state) => state.auth
  );

  const login = async (credentials) => {
    try {
      dispatch(loginStart());
      // Replace with your actual API endpoint
      const response = await axios.post('/api/auth/login', credentials);
      dispatch(loginSuccess(response.data));
      
      // Navigate based on user role
      if (response.data.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (response.data.user.role === 'jobseeker') {
        navigate('/jobseeker/dashboard');
      } else if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
    }
  };

  const register = async (userData) => {
    try {
      dispatch(loginStart());
      // Replace with your actual API endpoint
      const response = await axios.post('/api/auth/register', userData);
      dispatch(loginSuccess(response.data));
      
      // Navigate based on user role
      if (response.data.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (response.data.user.role === 'jobseeker') {
        navigate('/jobseeker/dashboard');
      }
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.message || 'Registration failed'));
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    navigate('/');
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Add token verification logic here
      return true;
    }
    return false;
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    userRole,
    login,
    register,
    logout: logoutUser,
    checkAuth,
  };
};

export default useAuth; 