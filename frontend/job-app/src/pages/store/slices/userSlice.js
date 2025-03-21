import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  users: [],
  loading: false,
  error: null,
  settings: {
    notifications: {
      email: true,
      push: true,
      jobAlerts: true,
      applicationUpdates: true,
    },
    privacy: {
      profileVisibility: 'public',
      resumeVisibility: 'private',
    },
  },
  resume: null,
  savedJobs: [],
  jobAlerts: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      const userIndex = state.users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        state.users[userIndex].status = status;
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    fetchProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
      state.error = null;
    },
    fetchProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    updateResume: (state, action) => {
      state.resume = action.payload;
    },
    addSavedJob: (state, action) => {
      state.savedJobs.push(action.payload);
    },
    removeSavedJob: (state, action) => {
      state.savedJobs = state.savedJobs.filter(
        (job) => job.id !== action.payload
      );
    },
    addJobAlert: (state, action) => {
      state.jobAlerts.push(action.payload);
    },
    removeJobAlert: (state, action) => {
      state.jobAlerts = state.jobAlerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
    updateJobAlert: (state, action) => {
      const index = state.jobAlerts.findIndex(
        (alert) => alert.id === action.payload.id
      );
      if (index !== -1) {
        state.jobAlerts[index] = action.payload;
      }
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfile,
  updateSettings,
  updateResume,
  addSavedJob,
  removeSavedJob,
  addJobAlert,
  removeJobAlert,
  updateJobAlert,
  updateUserStatus,
  deleteUser,
} = userSlice.actions;

export default userSlice.reducer; 