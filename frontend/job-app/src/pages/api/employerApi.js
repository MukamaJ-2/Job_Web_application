import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get employer profile
export const getEmployerProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/employers/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update employer profile
export const updateEmployerProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/employers/profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get employer's job postings
export const getEmployerJobs = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/employers/jobs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get applications for a specific job
export const getJobApplications = async (jobId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/employers/jobs/${jobId}/applications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Update application status
export const updateApplicationStatus = async (applicationId, status) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${API_URL}/employers/applications/${applicationId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Send message to applicant
export const sendMessageToApplicant = async (applicationId, message) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/employers/applications/${applicationId}/messages`,
    { message },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Get messages for an application
export const getApplicationMessages = async (applicationId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(
    `${API_URL}/employers/applications/${applicationId}/messages`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Get employer statistics
export const getEmployerStats = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/employers/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}; 