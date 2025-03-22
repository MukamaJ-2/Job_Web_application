// Import necessary modules and functions from Redux Toolkit and a custom API utility.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Asynchronous thunk for handling the login process
export const login = createAsyncThunk(
  'auth/login', // The action type prefix
  async (credentials, { rejectWithValue }) => {
    try {
      // Attempt to log in with the provided credentials
      const response = await api.post('/auth/login', credentials);
      // Store the returned token in localStorage for future authenticated requests
      localStorage.setItem('token', response.data.token);
      // Return the response data to be handled by reducers
      return response.data;
    } catch (error) {
      // If login fails, return a rejection with the error message or a default message
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

// Asynchronous thunk for handling user registration
export const register = createAsyncThunk(
  'auth/register', // The action type prefix
  async (userData, { rejectWithValue }) => {
    try {
      // Attempt to register a new user with the provided data
      const response = await api.post('/auth/register', userData);
      // Store the returned token in localStorage for future authenticated requests
      localStorage.setItem('token', response.data.token);
      // Return the response data to be handled by reducers
      return response.data;
    } catch (error) {
      // If registration fails, return a rejection with the error message or a default message
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

// Asynchronous thunk for handling user logout
export const logout = createAsyncThunk(
  'auth/logout', // The action type prefix
  async () => {
    // Remove the stored token from localStorage
    localStorage.removeItem('token');
  }
);

// Asynchronous thunk for fetching the current user's information
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser', // The action type prefix
  async (_, { rejectWithValue }) => {
    try {
      // Attempt to retrieve the current user's data
      const response = await api.get('/auth/me');
      // Return the response data to be handled by reducers
      return response.data;
    } catch (error) {
      // If fetching the user data fails, return a rejection with the error message or a default message
      return rejectWithValue(error.response?.data || 'Failed to get user data');
    }
  }
);

// Initial state for the authentication slice
const initialState = {
  user: null, // No user information initially
  token: localStorage.getItem('token'), // Retrieve token from localStorage if present
  loading: false, // Loading state for async operations
  error: null, // Error state for failed operations
  isAuthenticated: false, // Initially, the user is not authenticated
};

// Create the authentication slice with Redux Toolkit
const authSlice = createSlice({
  name: 'auth', // The slice's name
  initialState, // The initial state defined above
  reducers: {
    // Reducer to clear any existing error messages
    clearError: (state) => {
      state.error = null;
    },
  },
  // Handle actions from the async thunks using extraReducers
  extraReducers: (builder) => {
    builder
      // Handle the login lifecycle
      .addCase(login.pending, (state) => {
        // Set loading state and clear any previous errors
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        // On successful login, update user and token data, and set the authenticated flag
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        // On login failure, update the error state and stop loading
        state.loading = false;
        state.error = action.payload;
      })

      // Handle the registration lifecycle
      .addCase(register.pending, (state) => {
        // Set loading state and clear any previous errors
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        // On successful registration, update user and token data, and set the authenticated flag
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        // On registration failure, update the error state and stop loading
        state.loading = false;
        state.error = action.payload;
      })

      // Handle the logout lifecycle
      .addCase(logout.fulfilled, (state) => {
        // Clear user and token data and reset the authenticated flag
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Handle the getCurrentUser lifecycle
      .addCase(getCurrentUser.pending, (state) => {
        // Set loading state and clear any previous errors
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        // On successful data retrieval, update user data and set the authenticated flag
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        // On failure, update the error state, reset user and token data, and clear authentication
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      });
  },
});

// Export the clearError action for use in components
export const { clearError } = authSlice.actions;

// Export the reducer to be included in the store
export default authSlice.reducer;
