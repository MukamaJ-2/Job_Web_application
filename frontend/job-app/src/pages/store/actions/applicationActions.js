// Import the axios HTTP client for making API requests.
import axios from 'axios';

// Import action creators from the application slice.
// These actions are used to update the state in response to different events.
import {
  fetchApplicationsStart, // Indicates that an API request to fetch applications is in progress.
  fetchApplicationsSuccess, // Indicates the API request succeeded and provides the fetched applications data.
  fetchApplicationsFailure, // Indicates the API request failed and provides an error message.
  setSelectedApplication, // Sets the currently selected application in the state.
  addApplication, // Adds a newly submitted application to the state.
  updateApplicationStatus, // Updates the status of a specific application in the state.
  setApplicationFilters, // Sets the filters for retrieving applications.
  clearApplicationFilters, // Resets the application filters to their default state.
  setApplicationPage // Updates the current page number for paginated application results.
} from '../slices/applicationSlice';

// Define the base API URL for all application-related endpoints.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async action to fetch all applications, potentially filtered by the provided criteria.
export const fetchApplications = (filters = {}) => async (dispatch) => {
  try {
    dispatch(fetchApplicationsStart()); // Dispatch an action to indicate the fetch process has started.
    const response = await axios.get(`${API_URL}/applications`, { params: filters }); // Fetch applications from the API.
    dispatch(fetchApplicationsSuccess(response.data)); // Dispatch an action to store the fetched applications data.
    return response.data; // Return the fetched data for further use (optional).
  } catch (error) {
    // If the request fails, dispatch a failure action with the error message.
    const message = error.response?.data?.message || 'Failed to fetch applications';
    dispatch(fetchApplicationsFailure(message));
    throw error; // Re-throw the error so it can be handled elsewhere if needed.
  }
};

// Async action to fetch a single application by its ID.
export const getApplicationById = (applicationId) => async (dispatch) => {
  try {
    dispatch(fetchApplicationsStart()); // Dispatch an action to indicate the fetch process has started.
    const response = await axios.get(`${API_URL}/applications/${applicationId}`); // Fetch the application data from the API.
    dispatch(setSelectedApplication(response.data)); // Dispatch an action to set the selected application data.
    return response.data; // Return the fetched data for further use (optional).
  } catch (error) {
    // If the request fails, dispatch a failure action with the error message.
    const message = error.response?.data?.message || 'Failed to fetch application details';
    dispatch(fetchApplicationsFailure(message));
    throw error; // Re-throw the error so it can be handled elsewhere if needed.
  }
};

// Async action to submit a new application.
export const submitApplication = (applicationData) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/applications`, applicationData); // Submit the application data to the API.
    dispatch(addApplication(response.data)); // Dispatch an action to add the newly submitted application to the state.
    return response.data; // Return the newly created application data for further use (optional).
  } catch (error) {
    // If the submission fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to submit application';
    throw new Error(message);
  }
};

// Async action to update the status of a specific application by its ID.
export const updateApplicationStatusById = (applicationId, status) => async (dispatch) => {
  try {
    const response = await axios.patch(`${API_URL}/applications/${applicationId}`, { status }); // Update the application status via the API.
    dispatch(updateApplicationStatus({ applicationId, status })); // Dispatch an action to update the status in the state.
    return response.data; // Return the updated application data for further use (optional).
  } catch (error) {
    // If the status update fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to update application status';
    throw new Error(message);
  }
};

// Action to update the application filters in the state.
export const updateApplicationFilters = (filters) => (dispatch) => {
  dispatch(setApplicationFilters(filters)); // Dispatch an action to set the new filters.
};

// Action to reset the application filters to their default state.
export const resetApplicationFilters = () => (dispatch) => {
  dispatch(clearApplicationFilters()); // Dispatch an action to clear the current filters.
};

// Action to update the current page number in the state for paginated application results.
export const updateApplicationPage = (page) => (dispatch) => {
  dispatch(setApplicationPage(page)); // Dispatch an action to update the page number.
};
