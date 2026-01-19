import api from './api';

const CUSTOMER_BASE_URL = '/client-service/clients';

export const customerService = {
  // Récupérer tous les clients
  async getAll() {
    const response = await api.get(CUSTOMER_BASE_URL);
    return response.data;
  },

  // Récupérer un client par ID
  async getById(id) {
    const response = await api.get(`${CUSTOMER_BASE_URL}/${id}`);
    return response.data;
  },

  // Rechercher des clients par email ou téléphone
  async search(params) {
    const response = await api.get(CUSTOMER_BASE_URL, { params });
    return response.data;
  },

  // Créer un nouveau client
  async create(customerData) {
    const response = await api.post(CUSTOMER_BASE_URL, customerData);
    return response.data;
  },

  // Mettre à jour un client
  async update(id, customerData) {
    const response = await api.put(`${CUSTOMER_BASE_URL}/${id}`, customerData);
    return response.data;
  },

  // Suspendre un client
  async suspend(id) {
    const response = await api.put(`${CUSTOMER_BASE_URL}/${id}/suspend`);
    return response.data;
  },

  // Activer un client
  async activate(id) {
    const response = await api.put(`${CUSTOMER_BASE_URL}/${id}/activate`);
    return response.data;
  },

  // Supprimer un client (soft delete)
  async delete(id) {
    const response = await api.delete(`${CUSTOMER_BASE_URL}/${id}`);
    return response.data;
  },
};
