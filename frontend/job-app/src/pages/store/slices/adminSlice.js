// Import necessary modules from Redux Toolkit and axios.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the base API URL, defaulting to localhost if no environment variable is set.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create async thunks for various admin actions.

// Fetch all users, both job seekers and employers.
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async () => {
    const token = localStorage.getItem('token'); // Retrieve the authentication token.
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // Return the fetched users.
  }
);

// Update a user's status (e.g., activating or deactivating their account).
export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data; // Return the updated user data.
  }
);

// Update a user's information.
export const updateUserInfo = createAsyncThunk(
  'admin/updateUserInfo',
  async ({ userId, userData }) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}`,
      userData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data; // Return the updated user information.
  }
);

// Fetch various admin-level statistics.
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // Return the fetched statistics.
  }
);

// Fetch all job postings with detailed information.
export const fetchAllJobPostings = createAsyncThunk(
  'admin/fetchAllJobPostings',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/jobs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // Return the job postings data.
  }
);

// Fetch all job applications with detailed information.
export const fetchAllApplications = createAsyncThunk(
  'admin/fetchAllApplications',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/applications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // Return the applications data.
  }
);

// Update the status of a specific job posting.
export const updateJobStatus = createAsyncThunk(
  'admin/updateJobStatus',
  async ({ jobId, status }) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/admin/jobs/${jobId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data; // Return the updated job data.
  }
);

// Update the status of a specific application.
export const updateApplicationStatus = createAsyncThunk(
  'admin/updateApplicationStatus',
  async ({ applicationId, status }) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/admin/applications/${applicationId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data; // Return the updated application data.
  }
);

// Delete a job posting.
export const deleteJobPosting = createAsyncThunk(
  'admin/deleteJobPosting',
  async (jobId) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/admin/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return jobId; // Return the ID of the deleted job for updating the state.
  }
);

// Initial state of the admin slice.
const initialState = {
  users: {
    jobSeekers: [], // List of job seekers.
    employers: [] // List of employers.
  },
  stats: {
    totalUsers: 0,
    activeUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    recentActivity: [] // Recent activity logs or metrics.
  },
  jobPostings: [],
  applications: [],
  loading: false, // Indicator for async operations.
  error: null // Stores error messages from failed operations.
};

// Create the admin slice, defining reducers and handling extra reducers for async thunks.
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null; // Clear any existing error messages.
    },
    clearAdminData: (state) => {
      return initialState; // Reset the admin state to its initial values.
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching all users.
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true; // Indicate loading is in progress.
        state.error = null; // Clear previous errors.
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false; // Indicate loading is complete.
        state.users = action.payload; // Store the fetched user data.
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Store the error message.
      })
      // Handle updating a user's status.
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, role, status } = action.payload; // Extract data from the action payload.
        const userList = role === 'employer' ? state.users.employers : state.users.jobSeekers;
        const userIndex = userList.findIndex(user => user.id === id);
        if (userIndex !== -1) {
          userList[userIndex].status = status; // Update the user's status.
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Continue with similar cases for other async thunks, following the same pattern.
  }
});

// Export actions for clearing error and resetting admin data.
export const { clearError, clearAdminData } = adminSlice.actions;

// Export the admin slice reducer to be included in the Redux store.
export default adminSlice.reducer;
