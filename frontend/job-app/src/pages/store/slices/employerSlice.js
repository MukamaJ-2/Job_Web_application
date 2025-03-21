import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as employerApi from '../../api/employerApi';

// Fetch employer profile
export const fetchEmployerProfile = createAsyncThunk(
  'employer/fetchProfile',
  async () => {
    return await employerApi.getEmployerProfile();
  }
);

// Update employer profile
export const updateEmployerProfile = createAsyncThunk(
  'employer/updateProfile',
  async (profileData) => {
    return await employerApi.updateEmployerProfile(profileData);
  }
);

// Fetch employer statistics
export const fetchEmployerStats = createAsyncThunk(
  'employer/fetchStats',
  async () => {
    return await employerApi.getEmployerStats();
  }
);

// Fetch job applications
export const fetchJobApplications = createAsyncThunk(
  'employer/fetchJobApplications',
  async (jobId) => {
    return await employerApi.getJobApplications(jobId);
  }
);

// Fetch application messages
export const fetchApplicationMessages = createAsyncThunk(
  'employer/fetchApplicationMessages',
  async (applicationId) => {
    return await employerApi.getApplicationMessages(applicationId);
  }
);

const initialState = {
  profile: null,
  stats: null,
  applications: {},  // Keyed by jobId
  messages: {},      // Keyed by applicationId
  loading: false,
  error: null
};

const employerSlice = createSlice({
  name: 'employer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearEmployerData: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchEmployerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchEmployerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Profile
      .addCase(updateEmployerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateEmployerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Stats
      .addCase(fetchEmployerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchEmployerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Job Applications
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        const { jobId, applications } = action.payload;
        state.applications[jobId] = applications;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Application Messages
      .addCase(fetchApplicationMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { applicationId, messages } = action.payload;
        state.messages[applicationId] = messages;
      })
      .addCase(fetchApplicationMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError, clearEmployerData } = employerSlice.actions;

export default employerSlice.reducer; 