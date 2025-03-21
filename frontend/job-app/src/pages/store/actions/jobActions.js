import axios from 'axios';
import {
  fetchJobsStart,
  fetchJobsSuccess,
  fetchJobsFailure,
  setSelectedJob,
  addJobSuccess,
  updateJobSuccess,
  deleteJobSuccess,
  setJobFilters,
  clearJobFilters,
  setCurrentPage
} from '../slices/jobSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchJobs = (filters = {}) => async (dispatch) => {
  try {
    dispatch(fetchJobsStart());
    const response = await axios.get(`${API_URL}/jobs`, { params: filters });
    dispatch(fetchJobsSuccess(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch jobs';
    dispatch(fetchJobsFailure(message));
    throw error;
  }
};

export const getJobById = (jobId) => async (dispatch) => {
  try {
    dispatch(fetchJobsStart());
    const response = await axios.get(`${API_URL}/jobs/${jobId}`);
    dispatch(setSelectedJob(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch job details';
    dispatch(fetchJobsFailure(message));
    throw error;
  }
};

export const createJob = (jobData) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/jobs`, jobData);
    dispatch(addJobSuccess(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create job';
    throw new Error(message);
  }
};

export const updateJob = (jobId, jobData) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/jobs/${jobId}`, jobData);
    dispatch(updateJobSuccess(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update job';
    throw new Error(message);
  }
};

export const deleteJob = (jobId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/jobs/${jobId}`);
    dispatch(deleteJobSuccess(jobId));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete job';
    throw new Error(message);
  }
};

export const updateFilters = (filters) => (dispatch) => {
  dispatch(setJobFilters(filters));
};

export const clearFilters = () => (dispatch) => {
  dispatch(clearJobFilters());
};

export const updateCurrentPage = (page) => (dispatch) => {
  dispatch(setCurrentPage(page));
}; 