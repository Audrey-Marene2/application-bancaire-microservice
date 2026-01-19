// ==========================================
// src/api/accounts.js
// ==========================================
import apiClient from './client';
import { ENDPOINTS } from '../constants/config';

export const accountsAPI = {
  getAll: async () => {
    const response = await apiClient.get(ENDPOINTS.ACCOUNTS);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.ACCOUNT_BY_ID(id));
    return response.data;
  },

  getByCustomerId: async (customerId) => {
    const response = await apiClient.get(ENDPOINTS.ACCOUNTS_BY_CUSTOMER(customerId));
    return response.data;
  },

  create: async (accountData) => {
    const response = await apiClient.post(ENDPOINTS.ACCOUNTS, accountData);
    return response.data;
  },

  close: async (id) => {
    const response = await apiClient.delete(ENDPOINTS.ACCOUNT_BY_ID(id));
    return response.data;
  },
};
