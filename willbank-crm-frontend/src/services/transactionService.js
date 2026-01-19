import api from './api';

const TRANSACTION_BASE_URL = '/transaction-service/transactions';

export const transactionService = {
  // Récupérer toutes les transactions
  async getAll() {
    const response = await api.get(TRANSACTION_BASE_URL);
    return response.data;
  },

  // Récupérer les transactions d'un compte
  async getByAccountId(accountId, page = 0, size = 20) {
    const response = await api.get(`${TRANSACTION_BASE_URL}/account/${accountId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Effectuer un dépôt
  async deposit(accountId, amount) {
    const response = await api.post(`${TRANSACTION_BASE_URL}/deposit`, {
      accountId,
      amount
    });
    return response.data;
  },

  // Effectuer un retrait
  async withdraw(accountId, amount) {
    const response = await api.post(`${TRANSACTION_BASE_URL}/withdraw`, {
      accountId,
      amount
    });
    return response.data;
  },

  // Effectuer un virement
  async transfer(sourceAccountId, targetAccountId, amount) {
    const response = await api.post(`${TRANSACTION_BASE_URL}/transfer`, {
      sourceAccountId,
      targetAccountId,
      amount
    });
    return response.data;
  },

  // Rechercher des transactions
  async search(params) {
    const response = await api.get('/composite-service/transactions/search', { params });
    return response.data;
  },

  // Récupérer le relevé de compte
  async getStatement(accountId, from, to) {
    const response = await api.get(`/composite-service/accounts/${accountId}/statement`, {
      params: { from, to }
    });
    return response.data;
  },
};
