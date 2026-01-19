// ==========================================
// src/context/AppContext.js
// ==========================================
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const value = {
    accounts,
    setAccounts,
    transactions,
    setTransactions,
    notifications,
    setNotifications,
    selectedAccount,
    setSelectedAccount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ==========================================
// src/hooks/useAuth.js
// ==========================================
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};