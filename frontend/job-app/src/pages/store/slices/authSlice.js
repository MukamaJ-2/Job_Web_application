import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Registering user with data:', userData);
      const response = await axiosInstance.post('/auth/register', userData);
      console.log('Registration response:', response.data);

      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        if (error.response.status === 409) {
          return rejectWithValue('Email already exists. Please use a different email.');
        }
        if (error.response.status === 400) {
          return rejectWithValue(error.response.data.message || 'Invalid registration data');
        }
        return rejectWithValue(error.response.data.message || 'Registration failed');
      }
      if (error.request) {
        return rejectWithValue('No response from server. Please check your connection.');
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Logging in with credentials:', credentials);
      const response = await axiosInstance.post('/auth/login', credentials);
      console.log('Login response:', response.data);

      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        switch (error.response.status) {
          case 401:
            return rejectWithValue('Invalid email or password');
          case 404:
            return rejectWithValue('Server endpoint not found. Please check your connection.');
          case 400:
            return rejectWithValue('Invalid login credentials');
          default:
            return rejectWithValue(error.response.data.message || 'Login failed');
        }
      }
      if (error.request) {
        return rejectWithValue('No response from server. Please check your connection.');
      }
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      console.log('Fetching current user with token:', token);
      console.log('Stored user:', storedUser);

      if (!token) return rejectWithValue('No token found');

      const response = await axiosInstance.get('/auth/me');
      console.log('Current user response:', response.data);

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return rejectWithValue('Session expired. Please login again.');
          case 404:
            return rejectWithValue('User not found');
          default:
            return rejectWithValue('Failed to fetch user data');
        }
      }
      return rejectWithValue('Failed to fetch user data');
    }
  }
);

// Initialize state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;

  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
  }

  return {
    user,
    token,
    isAuthenticated: !!token,
    loading: false,
    error: null,
    userRole: user?.role || null
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      console.log('Logging out user');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userRole = null;
      state.error = null;
    },
    clearError: (state) => {
      console.log('Clearing error');
      state.error = null;
    },
    updateProfile: (state, action) => {
      console.log('Updating profile with data:', action.payload);
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        console.log('Register pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log('Register fulfilled:', action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userRole = action.payload.user.role;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        console.error('Register rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        console.log('Login pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('Login fulfilled:', action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userRole = action.payload.user.role;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        console.error('Login rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        console.log('Get current user pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        console.log('Get current user fulfilled:', action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.userRole = action.payload.role;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        console.error('Get current user rejected:', action.payload);
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

export const { logout, clearError, updateProfile } = authSlice.actions;

export default authSlice.reducer;
