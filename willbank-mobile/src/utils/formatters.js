// ==========================================
// src/utils/formatters.js
// ==========================================

// Formater un montant en FCFA
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0 FCFA';
  return `${parseFloat(amount).toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} FCFA`;
};

// Formater une date
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Formater une date avec heure
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Formater un nom de compte
export const formatAccountType = (type) => {
  const types = {
    CURRENT: 'Compte Courant',
    SAVINGS: 'Compte Épargne',
  };
  return types[type] || type;
};

// Formater un type de transaction
export const formatTransactionType = (type) => {
  const types = {
    DEPOSIT: 'Dépôt',
    WITHDRAWAL: 'Retrait',
    TRANSFER: 'Virement',
    PAYMENT: 'Paiement',
  };
  return types[type] || type;
};

// Formater un statut de compte
export const formatAccountStatus = (status) => {
  const statuses = {
    ACTIVE: 'Actif',
    FROZEN: 'Gelé',
    BLOCKED: 'Bloqué',
    CLOSED: 'Fermé',
  };
  return statuses[status] || status;
};

// Obtenir les initiales d'un nom
export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

// Masquer un numéro de compte (afficher seulement les 4 derniers chiffres)
export const maskAccountNumber = (accountId) => {
  if (!accountId) return '';
  const str = accountId.toString();
  return `****${str.slice(-4)}`;
};