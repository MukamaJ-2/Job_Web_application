// Import axios to handle HTTP requests.
import axios from 'axios';

// Import action creators from the user slice.
// These actions are used to update the user state in the Redux store.
import {
  fetchProfileStart, // Action to indicate the profile fetch process has started.
  fetchProfileSuccess, // Action to store the successfully fetched profile data.
  fetchProfileFailure, // Action to store the error message if profile fetch fails.
  updateProfile, // Action to update the profile data in the state.
  updateSettings, // Action to update user settings in the state.
  updateResume, // Action to store the uploaded resume in the state.
  addSavedJob, // Action to add a saved job to the user’s saved jobs list.
  removeSavedJob, // Action to remove a saved job from the user’s saved jobs list.
  addJobAlert, // Action to add a new job alert to the user’s alerts.
  removeJobAlert, // Action to remove a job alert from the user’s alerts.
  updateJobAlert, // Action to update an existing job alert’s settings.
  updateUserStatus, // Action to update a user’s status (admin functionality).
  deleteUser // Action to remove a user from the system (admin functionality).
} from '../slices/userSlice';

// Define the base API URL, using an environment variable or a default value.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Thunk to fetch the user’s profile.
export const fetchUserProfile = () => async (dispatch) => {
  try {
    dispatch(fetchProfileStart()); // Dispatch an action indicating the fetch is starting.
    const response = await axios.get(`${API_URL}/users/profile`); // Fetch profile data from the API.
    dispatch(fetchProfileSuccess(response.data)); // Dispatch a success action with the profile data.
    return response.data; // Return the profile data.
  } catch (error) {
    // If the request fails, dispatch a failure action with the error message.
    const message = error.response?.data?.message || 'Failed to fetch profile';
    dispatch(fetchProfileFailure(message));
    throw error; // Re-throw the error for further handling if needed.
  }
};

// Thunk to update the user’s profile.
export const updateUserProfile = (profileData) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/users/profile`, profileData); // Send updated profile data to the API.
    dispatch(updateProfile(response.data)); // Dispatch an action to update the profile data in the state.
    return response.data; // Return the updated profile data.
  } catch (error) {
    // If the update fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to update profile';
    throw new Error(message);
  }
};

// Thunk to update user settings.
export const updateUserSettings = (settings) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/users/settings`, settings); // Send updated settings data to the API.
    dispatch(updateSettings(response.data)); // Dispatch an action to update the settings in the state.
    return response.data; // Return the updated settings data.
  } catch (error) {
    // If the update fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to update settings';
    throw new Error(message);
  }
};

// Thunk to upload a resume file.
export const uploadResume = (file) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('resume', file); // Append the file to the FormData object.
    const response = await axios.post(`${API_URL}/users/resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }); // Send the resume file to the API.
    dispatch(updateResume(response.data)); // Dispatch an action to store the uploaded resume in the state.
    return response.data; // Return the response data.
  } catch (error) {
    // If the upload fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to upload resume';
    throw new Error(message);
  }
};

// Thunk to save a job by its ID.
export const saveJob = (jobId) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/users/saved-jobs`, { jobId }); // Send the job ID to the API to save it.
    dispatch(addSavedJob(response.data)); // Dispatch an action to add the saved job to the state.
    return response.data; // Return the saved job data.
  } catch (error) {
    // If the save operation fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to save job';
    throw new Error(message);
  }
};

// Thunk to remove a saved job by its ID.
export const unsaveJob = (jobId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/users/saved-jobs/${jobId}`); // Send a DELETE request to remove the saved job.
    dispatch(removeSavedJob(jobId)); // Dispatch an action to remove the job from the state.
  } catch (error) {
    // If the delete operation fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to remove saved job';
    throw new Error(message);
  }
};

// Thunk to create a new job alert.
export const createJobAlert = (alertData) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/users/job-alerts`, alertData); // Send the alert data to the API.
    dispatch(addJobAlert(response.data)); // Dispatch an action to add the new job alert to the state.
    return response.data; // Return the created job alert data.
  } catch (error) {
    // If the creation fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to create job alert';
    throw new Error(message);
  }
};

// Thunk to delete a job alert by its ID.
export const deleteJobAlert = (alertId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/users/job-alerts/${alertId}`); // Send a DELETE request to remove the job alert.
    dispatch(removeJobAlert(alertId)); // Dispatch an action to remove the alert from the state.
  } catch (error) {
    // If the delete operation fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to delete job alert';
    throw new Error(message);
  }
};

// Thunk to update an existing job alert’s settings.
export const updateJobAlertSettings = (alertId, settings) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/users/job-alerts/${alertId}`, settings); // Send updated alert settings to the API.
    dispatch(updateJobAlert(response.data)); // Dispatch an action to update the alert settings in the state.
    return response.data; // Return the updated alert data.
  } catch (error) {
    // If the update fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to update job alert';
    throw new Error(message);
  }
};

// Admin actions to manage user accounts.
// Thunk to update a user’s status by their ID (admin functionality).
export const updateUserStatusById = (userId, status) => async (dispatch) => {
  try {
    const response = await axios.patch(`${API_URL}/admin/users/${userId}/status`, { status }); // Send updated user status to the API.
    dispatch(updateUserStatus({ userId, status: response.data.status })); // Dispatch an action to update the user’s status in the state.
    return response.data; // Return the updated user data.
  } catch (error) {
    // If the update fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to update user status';
    throw new Error(message);
  }
};

// Thunk to delete a user by their ID (admin functionality).
export const deleteUserById = (userId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/admin/users/${userId}`); // Send a DELETE request to remove the user.
    dispatch(deleteUser(userId)); // Dispatch an action to remove the user from the state.
  } catch (error) {
    // If the delete operation fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to delete user';
    throw new Error(message);
  }
};
