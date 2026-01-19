import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import { transactionService } from '../../../services/transactionService';
import { accountService } from '../../../services/accountService';
import { customerService } from '../../../services/customerService';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  AlertCircle,
  Filter,
  Calendar
} from 'lucide-react';

export default function TransactionList() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [transactionsData, accountsData, customersData] = await Promise.all([
        transactionService.getAll(),
        accountService.getAll(),
        customerService.getAll()
      ]);
      
      // Create maps for quick lookup
      const accountsMap = {};
      accountsData.forEach((a) => {
        accountsMap[a.id] = a;
      });
      
      const customersMap = {};
      customersData.forEach((c) => {
        customersMap[c.id] = c;
      });
      
      setTransactions(transactionsData);
      setAccounts(accountsMap);
      setCustomers(customersMap);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'WITHDRAWAL':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'TRANSFER':
        return <ArrowLeftRight className="w-4 h-4 text-blue-500" />;
      default:
        return <ArrowLeftRight className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case 'DEPOSIT': return 'Dépôt';
      case 'WITHDRAWAL': return 'Retrait';
      case 'TRANSFER': return 'Virement';
      case 'PAYMENT': return 'Paiement';
      default: return type;
    }
  };

  // Apply filters
  const filteredTransactions = transactions.filter((t) => {
    if (filters.type && t.type !== filters.type) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.dateFrom && new Date(t.createdAt) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(t.createdAt) > new Date(filters.dateTo)) return false;
    return true;
  });

  // Calculate totals
  const totals = filteredTransactions.reduce((acc, t) => {
    if (t.status === 'SUCCESS') {
      if (t.type === 'DEPOSIT') acc.deposits += t.amount;
      else if (t.type === 'WITHDRAWAL') acc.withdrawals += t.amount;
      else if (t.type === 'TRANSFER') acc.transfers += t.amount;
    }
    return acc;
  }, { deposits: 0, withdrawals: 0, transfers: 0 });

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => (
        <span className="font-mono text-xs">{value?.substring(0, 8)}...</span>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getTransactionIcon(value)}
          <span>{getTransactionLabel(value)}</span>
        </div>
      )
    },
    {
      key: 'accountId',
      label: 'Compte / Client',
      render: (value) => {
        const account = accounts[value];
        const customer = account ? customers[account.customerId] : null;
        return (
          <div>
            <p className="font-medium">
              {account?.type === 'CURRENT' ? 'Courant' : 'Épargne'} •••• {value?.substring(0, 4)}
            </p>
            {customer && (
              <p className="text-xs text-gray-500">
                {customer.firstName} {customer.lastName}
              </p>
            )}
          </div>
        );
      }
    },
    {
      key: 'amount',
      label: 'Montant',
      render: (value, row) => (
        <span className={`font-semibold ${
          row.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
        }`}>
          {row.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value ? new Date(value).toLocaleString('fr-FR') : 'N/A'}
        </span>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestion des Transactions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filtres</span>
            </button>
            <button
              onClick={() => navigate('/admin/transactions/new')}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Nouvelle Transaction</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="">Tous</option>
                  <option value="DEPOSIT">Dépôt</option>
                  <option value="WITHDRAWAL">Retrait</option>
                  <option value="TRANSFER">Virement</option>
                  <option value="PAYMENT">Paiement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Statut</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="">Tous</option>
                  <option value="SUCCESS">Succès</option>
                  <option value="FAILED">Échoué</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date début</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date fin</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setFilters({ type: '', status: '', dateFrom: '', dateTo: '' })}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Total Dépôts</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(totals.deposits)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">Total Retraits</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-300">
                  {formatCurrency(totals.withdrawals)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Virements</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(totals.transfers)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredTransactions}
          loading={loading}
          searchable
          exportable
          onRefresh={fetchData}
          emptyMessage="Aucune transaction trouvée"
        />
      </div>
    </AdminLayout>
  );
}
