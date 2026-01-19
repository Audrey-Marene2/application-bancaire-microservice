import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/common/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import { dashboardService } from '../../services/dashboardService';
import {
  Users,
  CreditCard,
  ArrowLeftRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  Loader2,
  UserPlus,
  Ban,
  CheckCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tableau de bord
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Vue d'ensemble de l'activité WillBank
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Clients"
            value={stats?.customers?.total || 0}
            icon={Users}
            color="primary"
            subtitle={`${stats?.customers?.newThisWeek || 0} nouveaux cette semaine`}
          />
          <StatsCard
            title="Comptes Actifs"
            value={stats?.accounts?.active || 0}
            icon={CreditCard}
            color="green"
            subtitle={`${stats?.accounts?.total || 0} comptes au total`}
          />
          <StatsCard
            title="Transactions"
            value={stats?.transactions?.total || 0}
            icon={ArrowLeftRight}
            color="blue"
            subtitle={`${stats?.transactions?.successful || 0} réussies`}
          />
          <StatsCard
            title="Solde Total"
            value={formatCurrency(stats?.accounts?.totalBalance || 0)}
            icon={Wallet}
            color="purple"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Customer Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              Statut des Clients
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Actifs</span>
                </div>
                <span className="font-semibold">{stats?.customers?.active || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span>KYC en attente</span>
                </div>
                <span className="font-semibold">{stats?.customers?.pendingKyc || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Ban className="w-4 h-4 text-red-500" />
                  <span>Suspendus</span>
                </div>
                <span className="font-semibold">{stats?.customers?.suspended || 0}</span>
              </div>
            </div>
            <Link
              to="/admin/customers"
              className="block mt-4 text-center text-primary-600 dark:text-primary-400 hover:underline text-sm"
            >
              Voir tous les clients →
            </Link>
          </div>

          {/* Account Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-green-600" />
              Statut des Comptes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Actifs</span>
                </div>
                <span className="font-semibold">{stats?.accounts?.active || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <span>Gelés</span>
                </div>
                <span className="font-semibold">{stats?.accounts?.frozen || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Ban className="w-4 h-4 text-red-500" />
                  <span>Bloqués</span>
                </div>
                <span className="font-semibold">{stats?.accounts?.blocked || 0}</span>
              </div>
            </div>
            <Link
              to="/admin/accounts"
              className="block mt-4 text-center text-primary-600 dark:text-primary-400 hover:underline text-sm"
            >
              Voir tous les comptes →
            </Link>
          </div>

          {/* Transaction Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ArrowLeftRight className="w-5 h-5 mr-2 text-blue-600" />
              Résumé Transactions
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>Dépôts</span>
                </div>
                <span className="font-semibold text-green-600">
                  {formatCurrency(stats?.transactions?.totalDeposits || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span>Retraits</span>
                </div>
                <span className="font-semibold text-red-600">
                  {formatCurrency(stats?.transactions?.totalWithdrawals || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ArrowLeftRight className="w-4 h-4 text-blue-500" />
                  <span>Virements</span>
                </div>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(stats?.transactions?.totalTransfers || 0)}
                </span>
              </div>
            </div>
            <Link
              to="/admin/transactions"
              className="block mt-4 text-center text-primary-600 dark:text-primary-400 hover:underline text-sm"
            >
              Voir toutes les transactions →
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Transactions Récentes</h3>
            <Link
              to="/admin/transactions"
              className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
            >
              Voir tout
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Montant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats?.transactions?.recent?.length > 0 ? (
                  stats.transactions.recent.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-sm font-mono">
                        {transaction.id?.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          {transaction.type === 'DEPOSIT' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : transaction.type === 'WITHDRAWAL' ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : (
                            <ArrowLeftRight className="w-4 h-4 text-blue-500" />
                          )}
                          <span>
                            {transaction.type === 'DEPOSIT' ? 'Dépôt' :
                             transaction.type === 'WITHDRAWAL' ? 'Retrait' :
                             transaction.type === 'TRANSFER' ? 'Virement' : 'Paiement'}
                          </span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold ${
                        transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'DEPOSIT' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.createdAt).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      Aucune transaction récente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/customers/new"
            className="flex items-center justify-center space-x-2 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <UserPlus className="w-5 h-5" />
            <span>Nouveau Client</span>
          </Link>
          <Link
            to="/admin/accounts/new"
            className="flex items-center justify-center space-x-2 p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <CreditCard className="w-5 h-5" />
            <span>Nouveau Compte</span>
          </Link>
          <Link
            to="/admin/transactions/new"
            className="flex items-center justify-center space-x-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span>Nouvelle Transaction</span>
          </Link>
          <Link
            to="/admin/notifications"
            className="flex items-center justify-center space-x-2 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <AlertCircle className="w-5 h-5" />
            <span>Notifications</span>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
