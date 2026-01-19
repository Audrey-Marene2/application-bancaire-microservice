// ==========================================
// src/api/transactions.js
// ==========================================
import apiClient from './client';
import { ENDPOINTS } from '../constants/config';

export const transactionsAPI = {
  create: async (transactionData) => {
    const response = await apiClient.post(ENDPOINTS.TRANSACTIONS, transactionData);
    return response.data;
  },

  getByAccountId: async (accountId) => {
    const response = await apiClient.get(ENDPOINTS.TRANSACTIONS_BY_ACCOUNT(accountId));
    return response.data;
  },
};
