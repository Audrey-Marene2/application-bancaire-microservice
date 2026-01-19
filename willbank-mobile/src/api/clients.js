// ==========================================
// src/api/clients.js
// ==========================================
import apiClient from './client';
import { ENDPOINTS } from '../constants/config';

export const clientsAPI = {
  getAll: async () => {
    const response = await apiClient.get(ENDPOINTS.CLIENTS);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.CLIENT_BY_ID(id));
    return response.data;
  },

  getByEmail: async (email) => {
    const response = await apiClient.get(ENDPOINTS.CLIENT_BY_EMAIL, {
      params: { email },
    });
    return response.data;
  },

  create: async (clientData) => {
    const response = await apiClient.post(ENDPOINTS.CLIENTS, clientData);
    return response.data;
  },

  update: async (id, clientData) => {
    const response = await apiClient.put(ENDPOINTS.CLIENT_BY_ID(id), clientData);
    return response.data;
  },
};