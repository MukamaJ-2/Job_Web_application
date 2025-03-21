import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  applications: [],
  loading: false,
  error: null,
  selectedApplication: null,
  filters: {
    status: [],
    dateRange: null,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    fetchApplicationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchApplicationsSuccess: (state, action) => {
      state.loading = false;
      state.applications = action.payload.applications;
      state.pagination = {
        ...state.pagination,
        ...action.payload.pagination,
      };
      state.error = null;
    },
    fetchApplicationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedApplication: (state, action) => {
      state.selectedApplication = action.payload;
    },
    addApplication: (state, action) => {
      state.applications.unshift(action.payload);
    },
    updateApplicationStatus: (state, action) => {
      const { applicationId, status } = action.payload;
      const application = state.applications.find(
        (app) => app.id === applicationId
      );
      if (application) {
        application.status = status;
      }
      if (state.selectedApplication?.id === applicationId) {
        state.selectedApplication.status = status;
      }
    },
    setApplicationFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearApplicationFilters: (state) => {
      state.filters = initialState.filters;
    },
    setApplicationPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
});

export const {
  fetchApplicationsStart,
  fetchApplicationsSuccess,
  fetchApplicationsFailure,
  setSelectedApplication,
  addApplication,
  updateApplicationStatus,
  setApplicationFilters,
  clearApplicationFilters,
  setApplicationPage,
} = applicationSlice.actions;

export default applicationSlice.reducer; 