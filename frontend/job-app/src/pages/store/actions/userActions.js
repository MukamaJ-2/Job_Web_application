import axios from 'axios';
import {
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
  deleteUser
} from '../slices/userSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchUserProfile = () => async (dispatch) => {
  try {
    dispatch(fetchProfileStart());
    const response = await axios.get(`${API_URL}/users/profile`);
    dispatch(fetchProfileSuccess(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch profile';
    dispatch(fetchProfileFailure(message));
    throw error;
  }
};

export const updateUserProfile = (profileData) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/users/profile`, profileData);
    dispatch(updateProfile(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update profile';
    throw new Error(message);
  }
};

export const updateUserSettings = (settings) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/users/settings`, settings);
    dispatch(updateSettings(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update settings';
    throw new Error(message);
  }
};

export const uploadResume = (file) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await axios.post(`${API_URL}/users/resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    dispatch(updateResume(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to upload resume';
    throw new Error(message);
  }
};

export const saveJob = (jobId) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/users/saved-jobs`, { jobId });
    dispatch(addSavedJob(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to save job';
    throw new Error(message);
  }
};

export const unsaveJob = (jobId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/users/saved-jobs/${jobId}`);
    dispatch(removeSavedJob(jobId));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to remove saved job';
    throw new Error(message);
  }
};

export const createJobAlert = (alertData) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/users/job-alerts`, alertData);
    dispatch(addJobAlert(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create job alert';
    throw new Error(message);
  }
};

export const deleteJobAlert = (alertId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/users/job-alerts/${alertId}`);
    dispatch(removeJobAlert(alertId));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete job alert';
    throw new Error(message);
  }
};

export const updateJobAlertSettings = (alertId, settings) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/users/job-alerts/${alertId}`, settings);
    dispatch(updateJobAlert(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update job alert';
    throw new Error(message);
  }
};

// Admin actions
export const updateUserStatusById = (userId, status) => async (dispatch) => {
  try {
    const response = await axios.patch(`${API_URL}/admin/users/${userId}/status`, { status });
    dispatch(updateUserStatus({ userId, status: response.data.status }));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update user status';
    throw new Error(message);
  }
};

export const deleteUserById = (userId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/admin/users/${userId}`);
    dispatch(deleteUser(userId));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete user';
    throw new Error(message);
  }
}; 