// ==========================================
// src/api/transactions.js - VERSION CORRIGÉE
// ==========================================
import apiClient from './client';
import { ENDPOINTS } from '../constants/config';

export const transactionsAPI = {
  // Créer une transaction générique
  create: async (transactionData) => {
    const response = await apiClient.post(ENDPOINTS.TRANSACTIONS, transactionData);
    return response.data;
  },

  // Récupérer les transactions d'un compte
  getByAccountId: async (accountId) => {
    const response = await apiClient.get(ENDPOINTS.TRANSACTIONS_BY_ACCOUNT(accountId));
    return response.data;
  },

  // ✅ MÉTHODE TRANSFER CORRIGÉE
  transfer: async (transferData) => {
    console.log('📤 API Transfer - Données envoyées:', transferData);
    
    // Le backend attend un endpoint spécifique pour les virements
    const response = await apiClient.post(
      '/transaction-service/transactions',  // Endpoint unique
      {
        type: 'TRANSFER',                    // Type de transaction
        accountId: transferData.sourceAccountId,
        targetAccountId: transferData.targetAccountId,  // ✅ CRITIQUE
        amount: transferData.amount,
      }
    );
    
    console.log('📥 API Transfer - Réponse:', response.data);
    return response.data;
  },

  // Dépôt
  deposit: async (depositData) => {
    const response = await apiClient.post(
      '/transaction-service/transactions',
      {
        type: 'DEPOSIT',
        accountId: depositData.accountId,
        amount: depositData.amount,
      }
    );
    return response.data;
  },

  // Retrait
  withdraw: async (withdrawData) => {
    const response = await apiClient.post(
      '/transaction-service/transactions',
      {
        type: 'WITHDRAWAL',
        accountId: withdrawData.accountId,
        amount: withdrawData.amount,
      }
    );
    return response.data;
  },

  // Paiement
  payment: async (paymentData) => {
    const response = await apiClient.post(
      '/transaction-service/transactions',
      {
        type: 'PAYMENT',
        accountId: paymentData.accountId,
        amount: paymentData.amount,
        merchant: paymentData.merchant,
        reference: paymentData.reference,
      }
    );
    return response.data;
  },
};