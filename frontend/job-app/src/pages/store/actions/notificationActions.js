import axios from 'axios';
import {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
} from '../slices/notificationSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchNotifications = () => async (dispatch) => {
  try {
    dispatch(fetchNotificationsStart());
    const response = await axios.get(`${API_URL}/notifications`);
    dispatch(fetchNotificationsSuccess(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch notifications';
    dispatch(fetchNotificationsFailure(message));
    throw error;
  }
};

export const createNotification = (notificationData) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/notifications`, notificationData);
    dispatch(addNotification(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create notification';
    throw new Error(message);
  }
};

export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  try {
    const response = await axios.patch(`${API_URL}/notifications/${notificationId}/read`);
    dispatch(markAsRead(notificationId));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to mark notification as read';
    throw new Error(message);
  }
};

export const markAllNotificationsAsRead = () => async (dispatch) => {
  try {
    await axios.patch(`${API_URL}/notifications/mark-all-read`);
    dispatch(markAllAsRead());
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to mark all notifications as read';
    throw new Error(message);
  }
};

export const removeNotification = (notificationId) => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/notifications/${notificationId}`);
    dispatch(deleteNotification(notificationId));
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete notification';
    throw new Error(message);
  }
};

export const clearNotifications = () => async (dispatch) => {
  try {
    await axios.delete(`${API_URL}/notifications`);
    dispatch(clearAllNotifications());
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to clear notifications';
    throw new Error(message);
  }
}; 