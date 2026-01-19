import api from './api';

const NOTIFICATION_BASE_URL = '/notification-service/notifications';

export const notificationService = {
  // Récupérer toutes les notifications
  async getAll() {
    const response = await api.get(NOTIFICATION_BASE_URL);
    return response.data;
  },

  // Récupérer les notifications d'un client
  async getByCustomerId(customerId) {
    const response = await api.get(`${NOTIFICATION_BASE_URL}/customer/${customerId}`);
    return response.data;
  },

  // Envoyer une notification de test (usage interne)
  async sendTest(notificationData) {
    const response = await api.post(`${NOTIFICATION_BASE_URL}/test`, notificationData);
    return response.data;
  },

  // Marquer une notification comme lue
  async markAsRead(id) {
    const response = await api.put(`${NOTIFICATION_BASE_URL}/${id}/read`);
    return response.data;
  },
};
