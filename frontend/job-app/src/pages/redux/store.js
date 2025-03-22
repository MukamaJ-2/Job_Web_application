// Import the `configureStore` function from Redux Toolkit to create the Redux store.
import { configureStore } from '@reduxjs/toolkit';

// Import the slices for authentication and jobs.
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';

// Configure the store by combining the reducers from the different slices.
// `authReducer` handles state related to user authentication (e.g., login, register).
// `jobReducer` handles state related to job listings (e.g., fetching jobs, creating a new job).
export const store = configureStore({
  reducer: {
    auth: authReducer, // This reducer manages authentication-related state.
    jobs: jobReducer // This reducer manages job-related state.
  }
});

// Export the store as the default export so it can be used throughout the application.
export default store;
