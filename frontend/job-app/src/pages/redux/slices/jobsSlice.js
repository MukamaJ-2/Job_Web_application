// Import the necessary Redux Toolkit functions and the custom API utility.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Async thunk to fetch all jobs, potentially filtered by the provided criteria.
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs', // The action type.
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Make a GET request to fetch jobs from the API, passing any filters as query parameters.
      const response = await api.get('/jobs', { params: filters });
      return response.data; // If successful, return the fetched job data.
    } catch (error) {
      // If the API call fails, pass a meaningful error message to the rejected state.
      return rejectWithValue(error.response?.data || 'Failed to fetch jobs');
    }
  }
);

// Async thunk to fetch details of a single job by its ID.
export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (jobId, { rejectWithValue }) => {
    try {
      // Make a GET request to fetch details of the job with the given ID.
      const response = await api.get(`/jobs/${jobId}`);
      return response.data; // Return the job details if successful.
    } catch (error) {
      // Handle errors by passing an appropriate message to the rejected state.
      return rejectWithValue(error.response?.data || 'Failed to fetch job details');
    }
  }
);

// Async thunk to create a new job posting.
export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      // Make a POST request to create a new job with the provided data.
      const response = await api.post('/jobs', jobData);
      return response.data; // Return the newly created job data.
    } catch (error) {
      // Pass an error message to the rejected state if the API call fails.
      return rejectWithValue(error.response?.data || 'Failed to create job');
    }
  }
);

// Async thunk to update an existing job by its ID.
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      // Make a PUT request to update the job with the given ID and new data.
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data; // Return the updated job data.
    } catch (error) {
      // Handle errors by passing an appropriate message to the rejected state.
      return rejectWithValue(error.response?.data || 'Failed to update job');
    }
  }
);

// Async thunk to delete a job by its ID.
export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      // Make a DELETE request to remove the job with the given ID.
      await api.delete(`/jobs/${jobId}`);
      return jobId; // Return the ID of the deleted job so it can be removed from state.
    } catch (error) {
      // Pass an error message to the rejected state if the delete operation fails.
      return rejectWithValue(error.response?.data || 'Failed to delete job');
    }
  }
);

// The initial state for the jobs slice. This defines how the state looks before any actions are dispatched.
const initialState = {
  jobs: [], // An array to hold all fetched jobs.
  currentJob: null, // The currently selected job details.
  loading: false, // A flag indicating whether an API call is in progress.
  error: null, // A field to store error messages if a call fails.
  filters: { // Default filters for searching or filtering jobs.
    search: '',
    location: '',
    type: '',
    category: ''
  }
};

// Create the jobs slice, which defines the state and how it changes in response to actions.
const jobsSlice = createSlice({
  name: 'jobs', // The name of the slice.
  initialState, // The initial state defined above.
  reducers: {
    // Reducer to set filters for job listings.
    setFilters: (state, action) => {
      // Update the filters in the state by merging the current filters with new ones.
      state.filters = { ...state.filters, ...action.payload };
    },
    // Reducer to reset all filters to their default values.
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    // Reducer to clear the current error message from the state.
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Add extra reducers to handle the various states of the async thunks.

    // Handle fetching jobs.
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true; // Set loading to true when the fetch begins.
        state.error = null; // Clear any existing errors.
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false once the fetch completes.
        state.jobs = action.payload; // Store the fetched jobs in the state.
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false; // Set loading to false if the fetch fails.
        state.error = action.payload; // Store the error message.
      })

      // Handle fetching a job by ID.
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true; // Start loading when the fetch begins.
        state.error = null; // Clear any existing errors.
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false; // Stop loading once the fetch completes.
        state.currentJob = action.payload; // Store the fetched job details.
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false; // Stop loading if the fetch fails.
        state.error = action.payload; // Store the error message.
      })

      // Handle creating a new job.
      .addCase(createJob.pending, (state) => {
        state.loading = true; // Start loading when the creation process begins.
        state.error = null; // Clear any existing errors.
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false; // Stop loading once the job is created.
        state.jobs.push(action.payload); // Add the new job to the list.
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false; // Stop loading if creation fails.
        state.error = action.payload; // Store the error message.
      })

      // Handle updating a job.
      .addCase(updateJob.pending, (state) => {
        state.loading = true; // Start loading when the update begins.
        state.error = null; // Clear any existing errors.
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false; // Stop loading once the update completes.
        // Find and update the job in the state.
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        // If the currently viewed job is the one updated, update it too.
        if (state.currentJob?._id === action.payload._id) {
          state.currentJob = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false; // Stop loading if the update fails.
        state.error = action.payload; // Store the error message.
      })

      // Handle deleting a job.
      .addCase(deleteJob.pending, (state) => {
        state.loading = true; // Start loading when the delete process begins.
        state.error = null; // Clear any existing errors.
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false; // Stop loading once the delete completes.
        // Remove the deleted job from the list.
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
        // Clear the current job if it was deleted.
        if (state.currentJob?._id === action.payload) {
          state.currentJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false; // Stop loading if the delete fails.
        state.error = action.payload; // Store the error message.
      });
  }
});

// Export the actions defined in the slice.
export const { setFilters, clearFilters, clearError } = jobsSlice.actions;

// Export the reducer to be used in the Redux store.
export default jobsSlice.reducer;
