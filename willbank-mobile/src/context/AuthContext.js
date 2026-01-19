// ==========================================
// src/context/AuthContext.js - CORRECTION
// ==========================================
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../api/auth';
import { clientsAPI } from '../api/clients';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const email = await AsyncStorage.getItem('email');  // ✅ Changé de 'username' à 'email'

      if (token && email) {
        setUser({ email });
        await loadClientData(email);
      }
    } catch (err) {
      console.error('Restore session error:', err);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const loadClientData = async (email) => {
    try {
      console.log('📥 Chargement des données client pour:', email);
      const clientData = await clientsAPI.getByEmail(email);
      console.log('✅ Données client chargées:', clientData);
      setClient(clientData);
    } catch (err) {
      console.error('❌ Error loading client data:', err);
      
      // Si le client n'existe pas, on ne bloque pas l'authentification
      // L'utilisateur pourra créer son profil client plus tard
      if (err.response?.status === 404) {
        console.warn('⚠️ Profil client non trouvé pour:', email);
        setError("Profil client non trouvé. Veuillez créer votre profil.");
      } else {
        setError("Impossible de charger les informations du client");
      }
    }
  };

  // 🔐 LOGIN
  const login = async (usernameOrEmail, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔐 Tentative de connexion:', { 
        usernameOrEmail, 
        password: '***' 
      });

      if (!usernameOrEmail || !password) {
        throw new Error('Tous les champs sont obligatoires');
      }

      // Appel API
      const response = await authAPI.login(usernameOrEmail, password);

      console.log('✅ Réponse login:', response);

      if (!response.token) {
        throw new Error('Token manquant dans la réponse');
      }

      // Sauvegarder le token ET l'email
      await AsyncStorage.setItem('authToken', response.token);
      
      // ✅ CORRECTION: Sauvegarder l'email pour charger le client
      // Si l'utilisateur s'est connecté avec username, il faut récupérer l'email
      // Pour simplifier, on suppose que usernameOrEmail est l'email
      await AsyncStorage.setItem('email', usernameOrEmail);

      setUser({ email: usernameOrEmail });

      // Charger les données client
      await loadClientData(usernameOrEmail);

      return { success: true };

    } catch (err) {
      console.error('❌ Erreur login:', err);

      let message = 'Erreur de connexion';

      if (err.response) {
        if (err.response.status === 401) {
          message = 'Email ou mot de passe incorrect';
        } else if (err.response.data?.error) {
          message = err.response.data.error;
        }
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
      return { success: false, error: message };

    } finally {
      setLoading(false);
    }
  };

  // 📝 REGISTER
  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log('📝 Tentative d\'inscription:', { 
        username, 
        email, 
        password: '***' 
      });

      if (!username || !email || !password) {
        throw new Error('Tous les champs sont obligatoires');
      }

      // Appel API
      await authAPI.register(username, email, password);

      // Connexion automatique avec l'EMAIL (pas le username)
      return await login(email, password);  // ✅ Utiliser email

    } catch (err) {
      console.error('❌ Erreur register:', err);

      let message = 'Erreur lors de l\'inscription';

      if (err.response) {
        if (err.response.status === 400) {
          message = err.response.data?.error || 'Données invalides';
        }
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
      return { success: false, error: message };

    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setClient(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        client,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};