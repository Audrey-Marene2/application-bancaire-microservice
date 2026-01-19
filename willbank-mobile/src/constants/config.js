// ==========================================
// src/constants/config.js
// Compatible WEB + ANDROID EMULATOR
// ==========================================

import { Platform } from 'react-native';

// 🌐 API Gateway (unique point d’entrée)
const WEB_URL = 'http://localhost:8080';
const ANDROID_EMULATOR_URL = 'http://10.0.2.2:8080';

// 🔁 Sélection automatique selon la plateforme
export const API_BASE_URL =
  Platform.OS === 'web'
    ? WEB_URL
    : ANDROID_EMULATOR_URL;

// ================= ENDPOINTS =================

export const ENDPOINTS = {
  // 🔐 Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VALIDATE: '/auth/validate',

  // 👤 Client
  CLIENTS: '/client-service/clients',
  CLIENT_BY_ID: (id) => `/client-service/clients/${id}`,
  CLIENT_BY_EMAIL: '/client-service/clients/email',

  // 💳 Comptes
  ACCOUNTS: '/compte-service/accounts',
  ACCOUNTS_BY_CUSTOMER: (id) =>
    `/compte-service/accounts/customer/${id}`,

  // 💸 Transactions
TRANSACTIONS: '/transaction-service/transactions',

TRANSACTIONS_BY_ACCOUNT: (accountId) =>
  `/transaction-service/transactions/account/${accountId}`,

TRANSACTIONS_SEARCH: '/transaction-service/transactions/search',

  

  // 📊 Composite / Dashboard
  DASHBOARD: (customerId) =>
    `/composite-service/dashboard/${customerId}`,

  ACCOUNT_STATEMENT: (accountId) =>
    `/composite-service/accounts/${accountId}/statement`,

  TRANSACTIONS_SEARCH: '/transaction-service/transactions/search',

  // 🔔 Notifications
  NOTIFICATIONS_BY_CUSTOMER: (customerId) =>
    `/notification-service/notifications/customer/${customerId}`,
};


// ================= ENV =================

export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
};
