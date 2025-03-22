// Import necessary Redux Toolkit functions and a custom API utility.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Define async thunk for fetching a list of jobs with optional query parameters.
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params, { rejectWithValue }) => {
    try {
      // Make a GET request to fetch job listings.
      const response = await api.get('/jobs', { params });
      // Return the fetched data to the fulfilled reducer.
      return response.data;
    } catch (error) {
      // Handle errors by rejecting with an error message.
      return rejectWithValue(error.response?.data || 'Failed to fetch jobs');
    }
  }
);

// Define async thunk for fetching details of a specific job by its ID.
export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (id, { rejectWithValue }) => {
    try {
      // Make a GET request to fetch details of a single job.
      const response = await api.get(`/jobs/${id}`);
      // Return the fetched job details.
      return response.data;
    } catch (error) {
      // Handle errors by rejecting with an error message.
      return rejectWithValue(error.response?.data || 'Failed to fetch job details');
    }
  }
);

// Define async thunk for creating a new job posting.
export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      // Make a POST request to create a new job.
      const response = await api.post('/jobs', jobData);
      // Return the created job data.
      return response.data;
    } catch (error) {
      // Handle errors by rejecting with an error message.
      return rejectWithValue(error.response?.data || 'Failed to create job');
    }
  }
);

// Define async thunk for updating an existing job.
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      // Make a PUT request to update the job identified by ID.
      const response = await api.put(`/jobs/${id}`, jobData);
      // Return the updated job data.
      return response.data;
    } catch (error) {
      // Handle errors by rejecting with an error message.
      return rejectWithValue(error.response?.data || 'Failed to update job');
    }
  }
);

// Define async thunk for deleting a job by its ID.
export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { rejectWithValue }) => {
    try {
      // Make a DELETE request to remove the job by ID.
      await api.delete(`/jobs/${id}`);
      // Return the deleted job's ID so reducers can update the state.
      return id;
    } catch (error) {
      // Handle errors by rejecting with an error message.
      return rejectWithValue(error.response?.data || 'Failed to delete job');
    }
  }
);

// Initial state for the slice, including job list, loading state, error messages, and pagination details.
const initialState = {
  jobs: [], // List of jobs.
  currentJob: null, // Currently viewed job details.
  loading: false, // Whether any async operation is in progress.
  error: null, // Error message for the last failed operation.
  totalPages: 1, // Total number of pages of job listings (for pagination).
  currentPage: 1, // Current page number being viewed.
};

// Create a slice of the Redux state tree for job-related data.
const jobSlice = createSlice({
  name: 'jobs', // The slice name.
  initialState, // Initial state values.
  reducers: {
    // Action to clear the current error message from the state.
    clearError: (state) => {
      state.error = null;
    },
    // Action to clear the currently viewed job details.
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the fetchJobs lifecycle: pending, fulfilled, and rejected states.
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true; // Start loading.
        state.error = null; // Clear previous errors.
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false; // Stop loading.
        state.jobs = action.payload.jobs; // Update the list of jobs.
        state.totalPages = action.payload.totalPages; // Update pagination info.
        state.currentPage = action.payload.currentPage; // Set current page number.
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false; // Stop loading.
        state.error = action.payload; // Set the error message.
      })
      // Handle fetchJobById lifecycle: pending, fulfilled, and rejected states.
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true; // Start loading.
        state.error = null; // Clear previous errors.
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false; // Stop loading.
        state.currentJob = action.payload; // Update current job details.
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false; // Stop loading.
        state.error = action.payload; // Set the error message.
      })
      // Handle createJob lifecycle: pending, fulfilled, and rejected states.
      .addCase(createJob.pending, (state) => {
        state.loading = true; // Start loading.
        state.error = null; // Clear previous errors.
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false; // Stop loading.
        state.jobs.push(action.payload); // Add the created job to the list.
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false; // Stop loading.
        state.error = action.payload; // Set the error message.
      })
      // Handle updateJob lifecycle: pending, fulfilled, and rejected states.
      .addCase(updateJob.pending, (state) => {
        state.loading = true; // Start loading.
        state.error = null; // Clear previous errors.
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false; // Stop loading.
        // Find and update the existing job in the list.
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        // If the current job matches the updated job, update it as well.
        if (state.currentJob?._id === action.payload._id) {
          state.currentJob = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false; // Stop loading.
        state.error = action.payload; // Set the error message.
      })
      // Handle deleteJob lifecycle: pending, fulfilled, and rejected states.
      .addCase(deleteJob.pending, (state) => {
        state.loading = true; // Start loading.
        state.error = null; // Clear previous errors.
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false; // Stop loading.
        // Remove the deleted job from the list.
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
        // Clear the current job if it was the one deleted.
        if (state.currentJob?._id === action.payload) {
          state.currentJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false; // Stop loading.
        state.error = action.payload; // Set the error message.
      });
  },
});

// Export actions to clear errors or current job details.
export const { clearError, clearCurrentJob } = jobSlice.actions;

// Export the reducer to be used in the Redux store.
export default jobSlice.reducer;
