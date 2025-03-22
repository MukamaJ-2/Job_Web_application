// Import the axios HTTP client for making API requests
import axios from 'axios';

// Set the base API URL from an environment variable or a default value
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an axios instance with default configuration
const api = axios.create({
    baseURL: API_URL, // Set the base URL for all requests
    headers: {
        'Content-Type': 'application/json' // Ensure all requests send JSON content
    }
});

// Add a request interceptor to include authentication tokens
api.interceptors.request.use(
    (config) => {
        // Get the current authentication token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // If a token exists, include it in the request's Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // Proceed with the modified request config
    },
    (error) => {
        // If an error occurs, reject the promise with the error
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle specific response errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => response, // Pass through successful responses without modification
    async (error) => {
        const originalRequest = error.config;

        // If the response indicates the token is expired (401) and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark this request as retried

            try {
                // Attempt to refresh the authentication token
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                        refreshToken // Send the refresh token to get a new token
                    });

                    // Extract the new token from the response
                    const { token } = response.data;
                    localStorage.setItem('token', token); // Store the new token

                    // Update the original request with the new token and retry it
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refreshing the token fails, clear stored tokens and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // Redirect user to login page
            }
        }

        // If no special handling is required, reject the response error as usual
        return Promise.reject(error);
    }
);

// Utility function to set or remove the Authorization header on the axios instance
export const setAuthToken = (token) => {
    if (token) {
        // If a token is provided, set it in the default headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // If no token is provided, remove the Authorization header
        delete api.defaults.headers.common['Authorization'];
    }
};

// Export the configured axios instance for use throughout the application
export default api;
