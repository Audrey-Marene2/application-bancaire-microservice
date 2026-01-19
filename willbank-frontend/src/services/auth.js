import api from './api';

export const authService = {
  async register(username, email, password) {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  async login(username, password) {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);
    }
    
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getUsername() {
    return localStorage.getItem('username');
  },
};