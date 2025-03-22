// Import axios to handle HTTP requests.
import axios from 'axios';

// Import action creators from the auth slice, used to update authentication state in the Redux store.
import {
  loginStart, // Action to indicate the login process has started.
  loginSuccess, // Action to indicate login was successful, providing user data.
  loginFailure, // Action to handle login errors and provide error messages.
  logoutSuccess, // Action to handle logout and clear authentication state.
  registerStart, // Action to indicate the registration process has started.
  registerSuccess, // Action to indicate registration was successful, providing user data.
  registerFailure, // Action to handle registration errors and provide error messages.
  clearError // Action to clear any existing authentication errors.
} from '../slices/authSlice';

// Define the base API URL, falling back to a local default if the environment variable isn’t set.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Thunk for logging in a user with provided credentials.
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart()); // Dispatch an action to indicate the login process has started.

    // Make a POST request to the login endpoint with the user’s credentials.
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token, user } = response.data; // Extract the token and user data from the response.

    localStorage.setItem('token', token); // Store the token in local storage for future API calls.
    dispatch(loginSuccess(user)); // Dispatch a success action with the user data.

    return user; // Return the user data so it can be used elsewhere if needed.
  } catch (error) {
    // If the request fails, dispatch a failure action with an error message.
    const message = error.response?.data?.message || 'Login failed';
    dispatch(loginFailure(message));
    throw error; // Re-throw the error for further handling if needed.
  }
};

// Thunk for registering a new user with provided user data.
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart()); // Dispatch an action to indicate the registration process has started.

    // Make a POST request to the registration endpoint with the user’s data.
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    const { token, user } = response.data; // Extract the token and user data from the response.

    localStorage.setItem('token', token); // Store the token in local storage for future API calls.
    dispatch(registerSuccess(user)); // Dispatch a success action with the user data.

    return user; // Return the user data so it can be used elsewhere if needed.
  } catch (error) {
    // If the request fails, dispatch a failure action with an error message.
    const message = error.response?.data?.message || 'Registration failed';
    dispatch(registerFailure(message));
    throw error; // Re-throw the error for further handling if needed.
  }
};

// Function to log out the user.
export const logout = () => (dispatch) => {
  localStorage.removeItem('token'); // Remove the stored token from local storage.
  dispatch(logoutSuccess()); // Dispatch an action to update the store that the user is logged out.
};

// Function to clear any existing authentication errors from the state.
export const clearAuthError = () => (dispatch) => {
  dispatch(clearError()); // Dispatch an action to clear the error state.
};
