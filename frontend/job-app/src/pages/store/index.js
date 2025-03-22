// Import Redux Toolkit's configureStore function and reducers from different slices.
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import userReducer from './slices/userSlice';
import applicationReducer from './slices/applicationSlice';
import notificationReducer from './slices/notificationSlice';

// Configure the Redux store.
const store = configureStore({
  reducer: {
    // Combine all slice reducers under their respective keys.
    auth: authReducer, // Handles authentication-related state.
    jobs: jobReducer, // Handles state related to jobs and job postings.
    user: userReducer, // Manages user profile and user-specific settings.
    applications: applicationReducer, // Manages state for job applications.
    notifications: notificationReducer, // Manages state for notifications.
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable state checks to prevent errors with non-serializable data (like certain API responses or custom objects).
    }),
});

// Export the configured store for use in the application.
export default store;
