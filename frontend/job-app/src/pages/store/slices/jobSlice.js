// Import Redux Toolkit functions and axios instance
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks for performing asynchronous actions and handling the resulting states

// Fetch jobs based on optional filters
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Make a GET request to fetch jobs with the given filters
      const response = await axios.get('/jobs', { params: filters });
      return response.data;
    } catch (error) {
      // Return a custom error message if the request fails
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

// Fetch jobs posted by the current authenticated employer
export const fetchEmployerJobs = createAsyncThunk(
  'jobs/fetchEmployerJobs',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get the current user ID from the Redux state
      const { auth } = getState();
      const response = await axios.get(`/jobs/employer/${auth.user.id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employer jobs');
    }
  }
);

// Fetch all job applications submitted by the current user
export const fetchApplications = createAsyncThunk(
  'jobs/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/applications/me');
      // Return the list of applications from the response
      return response.data.applications || response.data;
    } catch (error) {
      // Log the error and return a custom error message
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

// Fetch a single job by its ID
export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job');
    }
  }
);

// Create a new job posting
export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

// Update an existing job posting by ID
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
  }
);

// Delete a job posting by ID
export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/jobs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
    }
  }
);

// Update the status of a specific job application
export const updateApplicationStatus = createAsyncThunk(
  'jobs/updateApplicationStatus',
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update application status');
    }
  }
);

// Send a message to an applicant for a specific job application
export const sendMessageToApplicant = createAsyncThunk(
  'jobs/sendMessageToApplicant',
  async ({ applicationId, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/applications/${applicationId}/message`, { message });
      return response.data.message || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

// Apply for a job by its ID
export const applyForJob = createAsyncThunk(
  'jobs/applyForJob',
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply for job');
    }
  }
);

// Initial state for the jobs slice
const initialState = {
  jobs: [],
  currentJob: null,
  applications: [],
  loading: false,
  error: null,
  messages: [],
  applicationStatus: {
    loading: false,
    error: null,
    success: false
  },
  filters: {
    search: '',
    location: '',
    type: '',
    category: ''
  }
};

// Define the jobs slice with reducers and extra reducers
const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Clear any existing error messages
    clearError: (state) => {
      state.error = null;
      state.applicationStatus.error = null;
    },
    // Clear the currently selected job
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    // Reset the application status object to its initial state
    clearApplicationStatus: (state) => {
      state.applicationStatus = {
        loading: false,
        error: null,
        success: false
      };
    },
    // Set or update the current filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Reset the filters to their initial state
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    // Handle async thunk actions and their pending, fulfilled, and rejected states

    // Fetch Jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Continue handling other thunks (e.g., fetchEmployerJobs, fetchJobById, createJob, updateJob, etc.)
    // using the same pattern of pending/fulfilled/rejected.
  }
});

// Export the reducers as actions
export const { clearError, clearCurrentJob, clearApplicationStatus, setFilters, clearFilters } = jobSlice.actions;

// Export the reducer to be included in the Redux store
export default jobSlice.reducer;
