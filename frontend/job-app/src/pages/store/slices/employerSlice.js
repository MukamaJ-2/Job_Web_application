// Import necessary modules from Redux Toolkit and the API functions from the employer API module.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as employerApi from '../../api/employerApi';

// Async thunk to fetch the employer's profile.
export const fetchEmployerProfile = createAsyncThunk(
  'employer/fetchProfile',
  async () => {
    // Calls the API to get the employer's profile and returns the result.
    return await employerApi.getEmployerProfile();
  }
);

// Async thunk to update the employer's profile.
export const updateEmployerProfile = createAsyncThunk(
  'employer/updateProfile',
  async (profileData) => {
    // Sends updated profile data to the API and returns the result.
    return await employerApi.updateEmployerProfile(profileData);
  }
);

// Async thunk to fetch the employer's statistics.
export const fetchEmployerStats = createAsyncThunk(
  'employer/fetchStats',
  async () => {
    // Calls the API to get the employer's statistics and returns the result.
    return await employerApi.getEmployerStats();
  }
);

// Async thunk to fetch job applications for a specific job.
export const fetchJobApplications = createAsyncThunk(
  'employer/fetchJobApplications',
  async (jobId) => {
    // Calls the API to get the applications for the given job and returns the result.
    return await employerApi.getJobApplications(jobId);
  }
);

// Async thunk to fetch messages for a specific application.
export const fetchApplicationMessages = createAsyncThunk(
  'employer/fetchApplicationMessages',
  async (applicationId) => {
    // Calls the API to get messages related to the given application and returns the result.
    return await employerApi.getApplicationMessages(applicationId);
  }
);

// Define the initial state for the employer slice.
const initialState = {
  profile: null, // Stores the employer's profile information.
  stats: null, // Stores the employer's statistics data.
  applications: {},  // Stores applications, keyed by jobId.
  messages: {},      // Stores messages, keyed by applicationId.
  loading: false, // Indicates whether a request is currently in progress.
  error: null // Stores any error messages that occur during API calls.
};

// Create a slice of state for employer-related data.
const employerSlice = createSlice({
  name: 'employer', // The name of the slice.
  initialState, // The initial state object.
  reducers: {
    // Reducer to clear any existing error messages.
    clearError: (state) => {
      state.error = null;
    },
    // Reducer to reset all employer-related state to its initial values.
    clearEmployerData: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    // Handle the pending, fulfilled, and rejected cases for each async thunk.

    // Fetch Profile
    builder
      .addCase(fetchEmployerProfile.pending, (state) => {
        state.loading = true; // Indicate loading is in progress.
        state.error = null; // Clear any previous errors.
      })
      .addCase(fetchEmployerProfile.fulfilled, (state, action) => {
        state.loading = false; // Loading is complete.
        state.profile = action.payload; // Store the fetched profile data.
      })
      .addCase(fetchEmployerProfile.rejected, (state, action) => {
        state.loading = false; // Loading is complete.
        state.error = action.error.message; // Store the error message.
      })

      // Update Profile
      .addCase(updateEmployerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload; // Update the profile data with the returned result.
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
        state.stats = action.payload; // Store the fetched statistics data.
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
        const { jobId, applications } = action.payload; // Destructure the response.
        state.applications[jobId] = applications; // Store applications for the specified job.
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
        const { applicationId, messages } = action.payload; // Destructure the response.
        state.messages[applicationId] = messages; // Store messages for the specified application.
      })
      .addCase(fetchApplicationMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

// Export actions to clear error messages and reset state.
export const { clearError, clearEmployerData } = employerSlice.actions;

// Export the reducer to be used in the Redux store.
export default employerSlice.reducer;
