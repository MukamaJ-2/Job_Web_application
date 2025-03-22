// Import Redux Toolkit's configureStore function and slice reducers.
import { configureStore } from '@reduxjs/toolkit';
import jobReducer from './slices/jobSlice'; // Manages job-related state.
import authReducer from './slices/authSlice'; // Manages authentication state.
import employerReducer from './slices/employerSlice'; // Manages employer-specific state.
import adminReducer from './slices/adminSlice'; // Manages admin-specific state.

// Configure the Redux store by combining multiple reducers under their respective keys.
export const store = configureStore({
  reducer: {
    jobs: jobReducer, // Handles state related to job listings, details, and applications.
    auth: authReducer, // Handles user authentication and session state.
    employer: employerReducer, // Handles state specific to employer actions and data.
    admin: adminReducer, // Handles state related to admin actions, user management, and platform statistics.
  },
});

// Export the configured store so it can be used in the application.
export default store;
