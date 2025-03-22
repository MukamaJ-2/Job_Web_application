// Import necessary functions and modules.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios'; // Preconfigured axios instance for API requests.

// Async thunk for user registration.
export const register = createAsyncThunk(
  'auth/register', // Unique action type for the thunk.
  async (userData, { rejectWithValue }) => {
    try {
      // Make a POST request to the registration endpoint.
      const response = await axiosInstance.post('/auth/register', userData);

      if (response.data.success) {
        // Store token and user data in local storage if registration is successful.
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data; // Return the response data for successful registration.
      } else {
        return rejectWithValue(response.data.message || 'Registration failed'); // Handle unsuccessful registration.
      }
    } catch (error) {
      // Handle various error scenarios, including server errors or conflict errors (e.g., email already exists).
      if (error.response) {
        if (error.response.status === 409) {
          return rejectWithValue('Email already exists. Please use a different email.');
        }
        return rejectWithValue(error.response.data.message || 'Registration failed');
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

// Async thunk for user login.
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Make a POST request to the login endpoint with user credentials.
      const response = await axiosInstance.post('/auth/login', credentials);

      if (response.data.success) {
        // Store token and user data in local storage if login is successful.
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data; // Return the response data for successful login.
      } else {
        return rejectWithValue(response.data.message || 'Login failed'); // Handle unsuccessful login.
      }
    } catch (error) {
      // Handle errors such as invalid credentials or server issues.
      if (error.response) {
        if (error.response.status === 401) {
          return rejectWithValue('Invalid email or password');
        }
        return rejectWithValue(error.response.data.message || 'Login failed');
      }
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

// Async thunk for fetching the currently authenticated user.
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // Retrieve the token from local storage.
      const token = localStorage.getItem('token');

      // If no token is found, reject with a message.
      if (!token) return rejectWithValue('No token found');

      // Make a GET request to fetch user information.
      const response = await axiosInstance.get('/auth/me');

      // Update local storage with the fetched user data.
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data; // Return the user data.
    } catch (error) {
      // Handle errors such as expired tokens or user not found.
      if (error.response) {
        if (error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return rejectWithValue('Session expired. Please login again.');
        }
        return rejectWithValue('Failed to fetch user data');
      }
      return rejectWithValue('Failed to fetch user data');
    }
  }
);

// Function to initialize the state based on stored values in local storage.
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;

  try {
    user = userStr ? JSON.parse(userStr) : null; // Parse stored user data if available.
  } catch (error) {
    // Handle errors in parsing and clean up storage.
    localStorage.removeItem('user');
  }

  // Return the initial state object.
  return {
    user,
    token,
    isAuthenticated: !!token,
    loading: false,
    error: null,
    userRole: user?.role || null
  };
};

// Create the auth slice using createSlice.
const authSlice = createSlice({
  name: 'auth', // Name of the slice.
  initialState: getInitialState(), // Initialize state from local storage.
  reducers: {
    // Reducer for logging out.
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userRole = null;
      state.error = null;
    },
    // Reducer to clear error messages.
    clearError: (state) => {
      state.error = null;
    },
    // Reducer to update the user profile.
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    // Handle the register async thunk actions.
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userRole = action.payload.user.role;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle the login async thunk actions.
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userRole = action.payload.user.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle the getCurrentUser async thunk actions.
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.userRole = action.payload.role;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.userRole = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        state.error = action.payload;
      });
  }
});

// Export the action creators and reducer.
export const { logout, clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;
