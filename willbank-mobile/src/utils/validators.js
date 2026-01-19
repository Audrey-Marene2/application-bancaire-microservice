// ==========================================
// src/utils/validators.js
// ==========================================

// Valider un email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Valider un mot de passe
export const validatePassword = (password) => {
  // Au moins 6 caractères
  return password && password.length >= 6;
};

// Valider un nom d'utilisateur
export const validateUsername = (username) => {
  // Au moins 3 caractères, alphanumérique
  const re = /^[a-zA-Z0-9_]{3,}$/;
  return re.test(username);
};

// Valider un numéro de téléphone
export const validatePhone = (phone) => {
  // Format international ou local
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return re.test(phone);
};

// Valider un montant
export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

// Messages d'erreur
export const getErrorMessage = (field, value) => {
  switch (field) {
    case 'email':
      if (!value) return 'L\'email est requis';
      if (!validateEmail(value)) return 'Email invalide';
      return '';
    case 'password':
      if (!value) return 'Le mot de passe est requis';
      if (!validatePassword(value)) return 'Au moins 6 caractères requis';
      return '';
    case 'username':
      if (!value) return 'Le nom d\'utilisateur est requis';
      if (!validateUsername(value)) return 'Au moins 3 caractères alphanumériques';
      return '';
    case 'phone':
      if (!value) return 'Le téléphone est requis';
      if (!validatePhone(value)) return 'Numéro de téléphone invalide';
      return '';
    case 'amount':
      if (!value) return 'Le montant est requis';
      if (!validateAmount(value)) return 'Montant invalide';
      return '';
    default:
      return '';
  }
};