import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Fetch all users (job seekers and employers)
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

// Update user status (activate/deactivate)
export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

// Update user information
export const updateUserInfo = createAsyncThunk(
  'admin/updateUserInfo',
  async ({ userId, userData }) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}`,
      userData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

// Fetch admin statistics
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

// Fetch all job postings with detailed info
export const fetchAllJobPostings = createAsyncThunk(
  'admin/fetchAllJobPostings',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/jobs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

// Fetch all applications with detailed info
export const fetchAllApplications = createAsyncThunk(
  'admin/fetchAllApplications',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/applications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

// Update job status
export const updateJobStatus = createAsyncThunk(
  'admin/updateJobStatus',
  async ({ jobId, status }) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/admin/jobs/${jobId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

// Update application status
export const updateApplicationStatus = createAsyncThunk(
  'admin/updateApplicationStatus',
  async ({ applicationId, status }) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/admin/applications/${applicationId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

// Delete job posting
export const deleteJobPosting = createAsyncThunk(
  'admin/deleteJobPosting',
  async (jobId) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/admin/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return jobId;
  }
);

const initialState = {
  users: {
    jobSeekers: [],
    employers: []
  },
  stats: {
    totalUsers: 0,
    activeUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    recentActivity: []
  },
  jobPostings: [],
  applications: [],
  loading: false,
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAdminData: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update User Status
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, role, status } = action.payload;
        const userList = role === 'employer' ? state.users.employers : state.users.jobSeekers;
        const userIndex = userList.findIndex(user => user.id === id);
        if (userIndex !== -1) {
          userList[userIndex].status = status;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update User Info
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        const { id, role } = action.payload;
        const userList = role === 'employer' ? state.users.employers : state.users.jobSeekers;
        const userIndex = userList.findIndex(user => user.id === id);
        if (userIndex !== -1) {
          userList[userIndex] = action.payload;
        }
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Admin Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch All Job Postings
      .addCase(fetchAllJobPostings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJobPostings.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPostings = action.payload;
      })
      .addCase(fetchAllJobPostings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch All Applications
      .addCase(fetchAllApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchAllApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Job Status
      .addCase(updateJobStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        state.loading = false;
        const jobIndex = state.jobPostings.findIndex(job => job.id === action.payload.id);
        if (jobIndex !== -1) {
          state.jobPostings[jobIndex] = action.payload;
        }
      })
      .addCase(updateJobStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Application Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const appIndex = state.applications.findIndex(app => app.id === action.payload.id);
        if (appIndex !== -1) {
          state.applications[appIndex] = action.payload;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Job Posting
      .addCase(deleteJobPosting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJobPosting.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPostings = state.jobPostings.filter(job => job.id !== action.payload);
        state.applications = state.applications.filter(app => app.job.id !== action.payload);
      })
      .addCase(deleteJobPosting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError, clearAdminData } = adminSlice.actions;

export default adminSlice.reducer; 