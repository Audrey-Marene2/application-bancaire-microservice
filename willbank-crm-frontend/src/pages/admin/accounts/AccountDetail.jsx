import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import { accountService } from '../../../services/accountService';
import { customerService } from '../../../services/customerService';
import { transactionService } from '../../../services/transactionService';
import {
  ArrowLeft,
  Lock,
  Unlock,
  Snowflake,
  XCircle,
  Loader2,
  AlertCircle,
  CreditCard,
  User,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  Clock,
  Plus,
  Minus,
  Calendar
} from 'lucide-react';

export default function AccountDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [account, setAccount] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [amount, setAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const accountData = await accountService.getById(id);
      setAccount(accountData);
      
      // Fetch customer data
      if (accountData.customerId) {
        const customerData = await customerService.getById(accountData.customerId);
        setCustomer(customerData);
      }
      
      // Fetch transactions
      const transactionsData = await transactionService.getByAccountId(id);
      setTransactions(transactionsData.content || transactionsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    try {
      setActionLoading(true);
      
      switch (actionType) {
        case 'freeze':
          await accountService.freeze(id);
          break;
        case 'block':
          await accountService.block(id);
          break;
        case 'activate':
          await accountService.activate(id);
          break;
        case 'close':
          await accountService.close(id);
          break;
        default:
          break;
      }
      
      setShowActionModal(false);
      setActionType('');
      await fetchData();
    } catch (err) {
      console.error('Error performing action:', err);
      alert(err.response?.data?.message || 'Erreur lors de l\'opération');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    try {
      setActionLoading(true);
      
      if (transactionType === 'DEPOSIT') {
        await transactionService.deposit(id, parseFloat(amount));
      } else {
        await transactionService.withdraw(id, parseFloat(amount));
      }
      
      setShowTransactionModal(false);
      setTransactionType('');
      setAmount('');
      await fetchData();
    } catch (err) {
      console.error('Error performing transaction:', err);
      alert(err.response?.data?.message || 'Erreur lors de la transaction');
    } finally {
      setActionLoading(false);
    }
  };

  const openActionModal = (type) => {
    setActionType(type);
    setShowActionModal(true);
  };

  const openTransactionModal = (type) => {
    setTransactionType(type);
    setShowTransactionModal(true);
  };

  const getActionTitle = () => {
    switch (actionType) {
      case 'freeze': return 'Geler le compte';
      case 'block': return 'Bloquer le compte';
      case 'activate': return 'Activer le compte';
      case 'close': return 'Fermer le compte';
      default: return 'Action';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
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

  if (error || !account) {
    return (
      <AdminLayout>
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error || 'Compte non trouvé'}</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/accounts')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Compte {account.type === 'CURRENT' ? 'Courant' : 'Épargne'}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <StatusBadge status={account.status} />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {account.id?.substring(0, 8)}...
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {account.status === 'ACTIVE' && (
              <>
                <button
                  onClick={() => openTransactionModal('DEPOSIT')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Dépôt</span>
                </button>
                <button
                  onClick={() => openTransactionModal('WITHDRAWAL')}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                  <span>Retrait</span>
                </button>
                <button
                  onClick={() => openActionModal('freeze')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Snowflake className="w-4 h-4" />
                  <span>Geler</span>
                </button>
                <button
                  onClick={() => openActionModal('block')}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>Bloquer</span>
                </button>
              </>
            )}
            
            {(account.status === 'FROZEN' || account.status === 'BLOCKED') && (
              <button
                onClick={() => openActionModal('activate')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Unlock className="w-4 h-4" />
                <span>Activer</span>
              </button>
            )}
            
            {account.status !== 'CLOSED' && account.balance === 0 && (
              <button
                onClick={() => openActionModal('close')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Fermer</span>
              </button>
            )}
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-2">Solde disponible</p>
              <div className="text-5xl font-bold">
                {formatCurrency(account.balance)}
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Info & Transactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold flex items-center">
                  <ArrowLeftRight className="w-5 h-5 mr-2 text-blue-600" />
                  Historique des transactions
                </h3>
              </div>
              
              {transactions.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'DEPOSIT'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {transaction.type === 'DEPOSIT' ? (
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : transaction.type === 'WITHDRAWAL' ? (
                            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                          ) : (
                            <ArrowLeftRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                          {formatCurrency(transaction.amount)}
                        </p>
                        <StatusBadge status={transaction.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-8 text-center text-gray-500 dark:text-gray-400">
                  Aucune transaction
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            {customer && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  Titulaire du compte
                </h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-semibold">
                      {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{customer.firstName} {customer.lastName}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <Link
                  to={`/admin/customers/${customer.id}`}
                  className="block text-center text-primary-600 dark:text-primary-400 hover:underline text-sm"
                >
                  Voir le profil client →
                </Link>
              </div>
            )}

            {/* Account Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Détails du compte</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Type de compte</label>
                  <p className="font-medium">
                    {account.type === 'CURRENT' ? 'Compte Courant' : 'Compte Épargne'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Statut</label>
                  <div className="mt-1">
                    <StatusBadge status={account.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> Date de création
                  </label>
                  <p className="font-medium">
                    {account.createdAt
                      ? new Date(account.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Nombre de transactions</label>
                  <p className="font-medium">{transactions.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => {
          setShowActionModal(false);
          setActionType('');
        }}
        title={getActionTitle()}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {actionType === 'freeze' && 'Le compte sera gelé temporairement. Les transactions seront suspendues.'}
            {actionType === 'block' && 'Le compte sera bloqué. Aucune opération ne sera possible.'}
            {actionType === 'activate' && 'Le compte sera réactivé et les opérations seront à nouveau possibles.'}
            {actionType === 'close' && 'Le compte sera fermé définitivement. Cette action est irréversible.'}
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowActionModal(false);
                setActionType('');
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
              disabled={actionLoading}
            >
              Annuler
            </button>
            <button
              onClick={handleAction}
              className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                actionType === 'close' || actionType === 'block'
                  ? 'bg-red-600 hover:bg-red-700'
                  : actionType === 'freeze'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={actionLoading}
            >
              {actionLoading ? 'En cours...' : 'Confirmer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Transaction Modal */}
      <Modal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setTransactionType('');
          setAmount('');
        }}
        title={transactionType === 'DEPOSIT' ? 'Effectuer un dépôt' : 'Effectuer un retrait'}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Montant (€)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="100.00"
              min="0"
              step="0.01"
              max={transactionType === 'WITHDRAWAL' ? account.balance : undefined}
            />
            {transactionType === 'WITHDRAWAL' && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Solde disponible: {formatCurrency(account.balance)}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowTransactionModal(false);
                setTransactionType('');
                setAmount('');
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
              disabled={actionLoading}
            >
              Annuler
            </button>
            <button
              onClick={handleTransaction}
              className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                transactionType === 'DEPOSIT'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              disabled={actionLoading}
            >
              {actionLoading ? 'En cours...' : 'Confirmer'}
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
