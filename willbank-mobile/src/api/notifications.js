// ==========================================
// src/api/notifications.js
// ==========================================
import apiClient from './client';
import { ENDPOINTS } from '../constants/config';

export const notificationsAPI = {
  getByCustomerId: async (customerId) => {
    const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS_BY_CUSTOMER(customerId));
    return response.data;
  },
};