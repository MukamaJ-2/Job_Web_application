// Import the Redux Toolkit function to create a slice of the Redux store.
import { createSlice } from '@reduxjs/toolkit';

// Define the initial state of the applications slice.
const initialState = {
  applications: [], // List of applications.
  loading: false, // Indicates if the application data is being fetched or updated.
  error: null, // Stores error messages when operations fail.
  selectedApplication: null, // The application that is currently viewed or being edited.
  filters: {
    status: [], // Array of status filters for applications.
    dateRange: null, // Date range filter for applications.
  },
  pagination: {
    currentPage: 1, // The current page of results.
    totalPages: 1, // The total number of pages available.
    totalItems: 0, // The total number of applications.
    itemsPerPage: 10, // The number of applications displayed per page.
  },
};

// Create a slice for application state management.
const applicationSlice = createSlice({
  name: 'applications', // Name of the slice.
  initialState, // The initial state for this slice.
  reducers: {
    // Reducer for starting the fetch applications process.
    fetchApplicationsStart: (state) => {
      state.loading = true;
      state.error = null; // Clear any previous error.
    },
    // Reducer for successfully fetching applications.
    fetchApplicationsSuccess: (state, action) => {
      state.loading = false; // Set loading to false since the fetch is complete.
      state.applications = action.payload.applications; // Update the list of applications.
      // Update the pagination info based on the response.
      state.pagination = {
        ...state.pagination,
        ...action.payload.pagination,
      };
      state.error = null; // Clear any previous error.
    },
    // Reducer for handling a failed fetch applications attempt.
    fetchApplicationsFailure: (state, action) => {
      state.loading = false; // Set loading to false since the fetch is complete.
      state.error = action.payload; // Set the error message from the action payload.
    },
    // Reducer for setting the currently selected application.
    setSelectedApplication: (state, action) => {
      state.selectedApplication = action.payload; // Store the selected application data.
    },
    // Reducer for adding a new application.
    addApplication: (state, action) => {
      state.applications.unshift(action.payload); // Add the new application to the start of the list.
    },
    // Reducer for updating the status of a specific application.
    updateApplicationStatus: (state, action) => {
      const { applicationId, status } = action.payload; // Get the application ID and new status from the action payload.
      const application = state.applications.find(
        (app) => app.id === applicationId
      ); // Find the application to update.
      if (application) {
        application.status = status; // Update the status of the application.
      }
      // If the currently selected application matches the ID, update its status as well.
      if (state.selectedApplication?.id === applicationId) {
        state.selectedApplication.status = status;
      }
    },
    // Reducer for updating the filters for applications.
    setApplicationFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }; // Merge the new filters with the existing filters.
    },
    // Reducer for clearing all application filters.
    clearApplicationFilters: (state) => {
      state.filters = initialState.filters; // Reset the filters to their initial state.
    },
    // Reducer for updating the current page of pagination.
    setApplicationPage: (state, action) => {
      state.pagination.currentPage = action.payload; // Set the current page number.
    },
  },
});

// Export the actions generated by createSlice.
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

// Export the reducer to be used in the Redux store.
export default applicationSlice.reducer;
