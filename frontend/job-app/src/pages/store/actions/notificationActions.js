// Import axios to handle HTTP requests.
import axios from 'axios';

// Import action creators from the notification slice.
// These actions are used to update the notifications state in the Redux store.
import {
  fetchNotificationsStart, // Indicates the fetch notifications process has started.
  fetchNotificationsSuccess, // Indicates fetch notifications was successful, providing the data.
  fetchNotificationsFailure, // Indicates fetch notifications failed, providing an error message.
  addNotification, // Adds a new notification to the state.
  markAsRead, // Marks a single notification as read in the state.
  markAllAsRead, // Marks all notifications as read in the state.
  deleteNotification, // Removes a specific notification from the state.
  clearAllNotifications // Removes all notifications from the state.
} from '../slices/notificationSlice';

// Define the base API URL, using an environment variable or falling back to a local default.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Thunk to fetch all notifications.
export const fetchNotifications = () => async (dispatch) => {
  try {
    dispatch(fetchNotificationsStart()); // Dispatch action to indicate fetch is starting.
    const response = await axios.get(`${API_URL}/notifications`); // Send GET request to the notifications endpoint.
    dispatch(fetchNotificationsSuccess(response.data)); // Dispatch action to store the fetched notifications.
    return response.data; // Return the data for further use (optional).
  } catch (error) {
    // If the request fails, dispatch a failure action with the error message.
    const message = error.response?.data?.message || 'Failed to fetch notifications';
    dispatch(fetchNotificationsFailure(message));
    throw error; // Re-throw the error for further handling if needed.
  }
};

// Thunk to create a new notification.
export const createNotification = (notificationData) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/notifications`, notificationData); // Send POST request with the notification data.
    dispatch(addNotification(response.data)); // Dispatch action to add the new notification to the state.
    return response.data; // Return the created notification data.
  } catch (error) {
    // If the request fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to create notification';
    throw new Error(message);
  }
};

// Thunk to mark a single notification as read.
export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  try {
    const response = await axios.patch(`${API_URL}/notifications/${notificationId}/read`); // Send PATCH request to mark notification as read.
    dispatch(markAsRead(notificationId)); // Dispatch action to update the state for the read notification.
    return response.data; // Return the updated notification data.
  } catch (error) {
    // If the request fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to mark notification as read';
    throw new Error(message);
  }
};

// Thunk to mark all notifications as read.
export const markAllNotificationsAsRead = () => async (dispatch) => {
  try {
    await axios.patch(`${API_URL}/notifications/mark-all-read`); // Send PATCH request to mark all notifications as read.
    dispatch(markAllAsRead()); // Dispatch action to update the state for all notifications.
  } catch (error) {
    // If the request fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to mark all notifications as read';
    throw new Error(message);
  }
};

// Thunk to delete a single notification.
export const removeNotification = (notificationId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/notifications/${notificationId}`); // Send DELETE request to remove a notification.
    dispatch(deleteNotification(notificationId)); // Dispatch action to remove the notification from the state.
  } catch (error) {
    // If the request fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to delete notification';
    throw new Error(message);
  }
};

// Thunk to clear all notifications.
export const clearNotifications = () => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/notifications`); // Send DELETE request to remove all notifications.
    dispatch(clearAllNotifications()); // Dispatch action to clear all notifications from the state.
  } catch (error) {
    // If the request fails, throw an error with a descriptive message.
    const message = error.response?.data?.message || 'Failed to clear notifications';
    throw new Error(message);
  }
};
