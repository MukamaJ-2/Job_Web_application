import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/jobs', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchEmployerJobs = createAsyncThunk(
  'jobs/fetchEmployerJobs',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`/jobs/employer/${auth.user.id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employer jobs');
    }
  }
);

export const fetchApplications = createAsyncThunk(
  'jobs/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching applications for current user');
      const response = await axios.get('/applications/me');
      console.log('Applications fetched successfully:', response.data);
      return response.data.applications || response.data;
    } catch (error) {
      console.error('Error fetching applications:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

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

export const sendMessageToApplicant = createAsyncThunk(
  'jobs/sendMessageToApplicant',
  async ({ applicationId, message }, { rejectWithValue }) => {
    try {
      console.log('Sending message to applicant:', applicationId, message);
      const response = await axios.post(`/applications/${applicationId}/message`, { message });
      console.log('Message sent successfully:', response.data);
      return response.data.message || response.data;
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

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

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.applicationStatus.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearApplicationStatus: (state) => {
      state.applicationStatus = {
        loading: false,
        error: null,
        success: false
      };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
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
      })
      // Fetch Employer Jobs
      .addCase(fetchEmployerJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchEmployerJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Job By ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob?.id === action.payload.id) {
          state.currentJob = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(job => job.id !== action.payload);
        if (state.currentJob?.id === action.payload) {
          state.currentJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Application Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const application = action.payload;
        const job = state.jobs.find(j => j.id === application.job_id);
        if (job) {
          const appIndex = job.applications.findIndex(a => a.id === application.id);
          if (appIndex !== -1) {
            job.applications[appIndex] = application;
          }
        }
        // Update in applications array if it exists
        const appIndex = state.applications.findIndex(a => a.id === application.id);
        if (appIndex !== -1) {
          state.applications[appIndex] = application;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send Message to Applicant
      .addCase(sendMessageToApplicant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessageToApplicant.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessageToApplicant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Apply for Job
      .addCase(applyForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.push(action.payload);
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentJob, clearApplicationStatus, setFilters, clearFilters } = jobSlice.actions;

export default jobSlice.reducer; 