// ==========================================
// src/api/composite.js - FICHIER MANQUANT
// ==========================================
import apiClient from './client';
import { ENDPOINTS } from '../constants/config';

export const compositeAPI = {
  // Dashboard avec agrégation de données
  getDashboard: async (customerId) => {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD(customerId));
    return response.data;
  },

  // Relevé de compte complet
  getAccountStatement: async (accountId) => {
    const response = await apiClient.get(ENDPOINTS.ACCOUNT_STATEMENT(accountId));
    return response.data;
  },

  // Recherche de transactions avec filtres
  searchTransactions: async (filters) => {
    const response = await apiClient.get(ENDPOINTS.TRANSACTIONS_SEARCH, {
      params: filters,
    });
    return response.data;
  },
};