import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Récupérer le client par username (ou email)
      const clientsResponse = await api.get('/client-service/clients');
      const currentClient = clientsResponse.data.find(
        (c) => c.email === `${username}@willbank.com` || c.firstName.toLowerCase() === username.toLowerCase()
      );

      if (!currentClient) {
        setError('Client introuvable');
        return;
      }

      // 2. Récupérer le dashboard complet
      const dashboardResponse = await api.get(`/composite-service/dashboard/${currentClient.id}`);
      setDashboardData(dashboardResponse.data);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="card bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-600">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout>
        <div className="card">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Aucune donnée disponible
          </p>
        </div>
      </Layout>
    );
  }

  const { client, accounts, totalBalance, recentTransactions } = dashboardData;

  return (
    <Layout>
      <div className="space-y-6 animate-slide-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Bonjour, {client.firstName} ! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Bienvenue sur votre espace personnel
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Solde total */}
        <div className="balance-card animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wallet className="w-6 h-6" />
              <span className="text-white/80">Solde total</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              client.status === 'ACTIVE' 
                ? 'bg-green-500/20 text-green-100' 
                : 'bg-red-500/20 text-red-100'
            }`}>
              {client.status}
            </span>
          </div>
          <div className="text-5xl font-bold mb-2">
            {totalBalance.toLocaleString('fr-FR', { 
              style: 'currency', 
              currency: 'EUR' 
            })}
          </div>
          <p className="text-white/60 text-sm">
            {accounts.length} compte{accounts.length > 1 ? 's' : ''} actif{accounts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Liste des comptes */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Mes comptes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account, index) => (
              <div
                key={account.id}
                onClick={() => navigate(`/account/${account.id}`)}
                className="card hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-105 animate-slide-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Compte {account.type === 'CURRENT' ? 'Courant' : 'Épargne'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        •••• {account.id.substring(0, 4)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    account.status === 'ACTIVE' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : account.status === 'BLOCKED'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {account.status}
                  </span>
                </div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {account.balance.toLocaleString('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions récentes */}
        <div className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold mb-4">Transactions récentes</h2>
          <div className="card">
            {recentTransactions && recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'DEPOSIT' 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {transaction.type === 'DEPOSIT' ? (
                          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {transaction.type === 'DEPOSIT' ? 'Dépôt' : 
                           transaction.type === 'WITHDRAWAL' ? 'Retrait' :
                           transaction.type === 'TRANSFER' ? 'Virement' : 'Paiement'}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(transaction.createdAt).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transaction.type === 'DEPOSIT' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'DEPOSIT' ? '+' : '-'}
                        {transaction.amount.toLocaleString('fr-FR', { 
                          style: 'currency', 
                          currency: 'EUR' 
                        })}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'SUCCESS'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Aucune transaction récente
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}