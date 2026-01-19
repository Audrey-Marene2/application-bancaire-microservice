import api from './api';

export const dashboardService = {
  // Récupérer le dashboard d'un client
  async getCustomerDashboard(customerId) {
    const response = await api.get(`/composite-service/dashboard/${customerId}`);
    return response.data;
  },

  // Récupérer les statistiques globales pour le CRM admin
  async getAdminStats() {
    try {
      // Récupérer les données de tous les services
      const [customers, accounts, transactions] = await Promise.all([
        api.get('/client-service/clients'),
        api.get('/compte-service/accounts'),
        api.get('/transaction-service/transactions')
      ]);

      const customersData = customers.data || [];
      const accountsData = accounts.data || [];
      const transactionsData = transactions.data || [];

      // Calculer les statistiques
      const totalCustomers = customersData.length;
      const activeCustomers = customersData.filter(c => c.status === 'ACTIVE').length;
      const pendingKycCustomers = customersData.filter(c => c.status === 'PENDING_KYC').length;
      const suspendedCustomers = customersData.filter(c => c.status === 'SUSPENDED').length;

      const totalAccounts = accountsData.length;
      const activeAccounts = accountsData.filter(a => a.status === 'ACTIVE').length;
      const blockedAccounts = accountsData.filter(a => a.status === 'BLOCKED').length;
      const frozenAccounts = accountsData.filter(a => a.status === 'FROZEN').length;

      const totalBalance = accountsData.reduce((sum, a) => sum + (a.balance || 0), 0);

      const totalTransactions = transactionsData.length;
      const successfulTransactions = transactionsData.filter(t => t.status === 'SUCCESS').length;
      const failedTransactions = transactionsData.filter(t => t.status === 'FAILED').length;

      const totalDeposits = transactionsData
        .filter(t => t.type === 'DEPOSIT' && t.status === 'SUCCESS')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const totalWithdrawals = transactionsData
        .filter(t => t.type === 'WITHDRAWAL' && t.status === 'SUCCESS')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const totalTransfers = transactionsData
        .filter(t => t.type === 'TRANSFER' && t.status === 'SUCCESS')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      // Transactions récentes (10 dernières)
      const recentTransactions = transactionsData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      // Nouveaux clients (7 derniers jours)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const newCustomersThisWeek = customersData.filter(
        c => new Date(c.createdAt) >= sevenDaysAgo
      ).length;

      return {
        customers: {
          total: totalCustomers,
          active: activeCustomers,
          pendingKyc: pendingKycCustomers,
          suspended: suspendedCustomers,
          newThisWeek: newCustomersThisWeek
        },
        accounts: {
          total: totalAccounts,
          active: activeAccounts,
          blocked: blockedAccounts,
          frozen: frozenAccounts,
          totalBalance
        },
        transactions: {
          total: totalTransactions,
          successful: successfulTransactions,
          failed: failedTransactions,
          totalDeposits,
          totalWithdrawals,
          totalTransfers,
          recent: recentTransactions
        }
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  },
};
