import api from './api';

const ACCOUNT_BASE_URL = '/compte-service/accounts';

export const accountService = {
  // Récupérer tous les comptes
  async getAll() {
    const response = await api.get(ACCOUNT_BASE_URL);
    return response.data;
  },

  // Récupérer un compte par ID
  async getById(id) {
    const response = await api.get(`${ACCOUNT_BASE_URL}/${id}`);
    return response.data;
  },

  // Récupérer les comptes d'un client
  async getByCustomerId(customerId) {
    const response = await api.get(`${ACCOUNT_BASE_URL}/customer/${customerId}`);
    return response.data;
  },

  // Créer un nouveau compte
  async create(accountData) {
    const response = await api.post(ACCOUNT_BASE_URL, accountData);
    return response.data;
  },

  // Geler un compte
  async freeze(id) {
    const response = await api.put(`${ACCOUNT_BASE_URL}/${id}/freeze`);
    return response.data;
  },

  // Bloquer un compte
  async block(id) {
    const response = await api.put(`${ACCOUNT_BASE_URL}/${id}/block`);
    return response.data;
  },

  // Débloquer/Activer un compte
  async activate(id) {
    const response = await api.put(`${ACCOUNT_BASE_URL}/${id}/activate`);
    return response.data;
  },

  // Fermer un compte
  async close(id) {
    const response = await api.put(`${ACCOUNT_BASE_URL}/${id}/close`);
    return response.data;
  },

  // Mettre à jour le solde (appel interne sécurisé)
  async updateBalance(id, balance) {
    const response = await api.put(`${ACCOUNT_BASE_URL}/${id}/balance`, { balance });
    return response.data;
  },
};
