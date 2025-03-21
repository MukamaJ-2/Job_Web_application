import axios from 'axios';
import {
  fetchApplicationsStart,
  fetchApplicationsSuccess,
  fetchApplicationsFailure,
  setSelectedApplication,
  addApplication,
  updateApplicationStatus,
  setApplicationFilters,
  clearApplicationFilters,
  setApplicationPage
} from '../slices/applicationSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchApplications = (filters = {}) => async (dispatch) => {
  try {
    dispatch(fetchApplicationsStart());
    const response = await axios.get(`${API_URL}/applications`, { params: filters });
    dispatch(fetchApplicationsSuccess(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch applications';
    dispatch(fetchApplicationsFailure(message));
    throw error;
  }
};

export const getApplicationById = (applicationId) => async (dispatch) => {
  try {
    dispatch(fetchApplicationsStart());
    const response = await axios.get(`${API_URL}/applications/${applicationId}`);
    dispatch(setSelectedApplication(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch application details';
    dispatch(fetchApplicationsFailure(message));
    throw error;
  }
};

export const submitApplication = (applicationData) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/applications`, applicationData);
    dispatch(addApplication(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to submit application';
    throw new Error(message);
  }
};

export const updateApplicationStatusById = (applicationId, status) => async (dispatch) => {
  try {
    const response = await axios.patch(`${API_URL}/applications/${applicationId}`, { status });
    dispatch(updateApplicationStatus({ applicationId, status }));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update application status';
    throw new Error(message);
  }
};

export const updateApplicationFilters = (filters) => (dispatch) => {
  dispatch(setApplicationFilters(filters));
};

export const resetApplicationFilters = () => (dispatch) => {
  dispatch(clearApplicationFilters());
};

export const updateApplicationPage = (page) => (dispatch) => {
  dispatch(setApplicationPage(page));
}; 