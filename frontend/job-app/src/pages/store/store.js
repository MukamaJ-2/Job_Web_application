import { configureStore } from '@reduxjs/toolkit';
import jobReducer from './slices/jobSlice';
import authReducer from './slices/authSlice';
import employerReducer from './slices/employerSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    jobs: jobReducer,
    auth: authReducer,
    employer: employerReducer,
    admin: adminReducer,
  },
});

export default store; 