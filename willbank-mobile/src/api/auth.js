// ==========================================
// src/api/auth.js - VERSION CORRIGÉE
// ==========================================
import apiClient from './client';
import { ENDPOINTS } from '../constants/config';

export const authAPI = {
  login: async (username, password) => {
    const response = await apiClient.post(ENDPOINTS.LOGIN, {
      username,
      password,
    });
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await apiClient.post(ENDPOINTS.REGISTER, {
      username,
      email,
      password,
    });
    return response.data;
  },

  validateToken: async () => {
    const response = await apiClient.get(ENDPOINTS.VALIDATE);
    return response.data;
  },
};

// ⚠️ ATTENTION: Vous importez authService dans AuthContext
// mais vous avez défini authAPI ici
// Créez un export compatible:
export const authService = authAPI;