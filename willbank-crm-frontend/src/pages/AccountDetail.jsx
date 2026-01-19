import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import { 
  ArrowLeft,
  TrendingUp, 
  TrendingDown,
  Plus,
  Minus,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';

export default function AccountDetail() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statementData, setStatementData] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState('');

  useEffect(() => {
    fetchStatement();
  }, [accountId]);

  const fetchStatement = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/composite-service/accounts/${accountId}/statement`);
      setStatementData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (type) => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    setTransactionLoading(true);
    setTransactionSuccess('');

    try {
      await api.post('/transaction-service/transactions', {
        accountId,
        type,
        amount: parseFloat(amount),
      });

      setTransactionSuccess(`${type === 'DEPOSIT' ? 'Dépôt' : 'Retrait'} effectué avec succès !`);
      setAmount('');
      setShowDepositModal(false);
      setShowWithdrawModal(false);

      // Recharger les données
      setTimeout(() => {
        fetchStatement();
        setTransactionSuccess('');
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la transaction');
    } finally {
      setTransactionLoading(false);
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

  if (!statementData) return null;

  const { account, client, transactions } = statementData;

  return (
    <Layout>
      <div className="space-y-6 animate-slide-in">
        {/* Succès notification */}
        {transactionSuccess && (
          <div className="fixed top-20 right-4 z-50 card bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 animate-slide-in">
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>{transactionSuccess}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">
              Compte {account.type === 'CURRENT' ? 'Courant' : 'Épargne'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {client.firstName} {client.lastName}
            </p>
          </div>
        </div>

        {/* Solde et actions */}
        <div className="balance-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/80 mb-2">Solde disponible</p>
              <div className="text-5xl font-bold">
                {account.balance.toLocaleString('fr-FR', { 
                  style: 'currency', 
                  currency: 'EUR' 
                })}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              account.status === 'ACTIVE' 
                ? 'bg-green-500/20 text-green-100' 
                : 'bg-red-500/20 text-red-100'
            }`}>
              {account.status}
            </span>
          </div>

          {account.status === 'ACTIVE' && (
            <div className="flex gap-4">
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Dépôt</span>
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Minus className="w-5 h-5" />
                <span>Retrait</span>
              </button>
            </div>
          )}
        </div>

        {/* Historique des transactions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Historique des transactions</h2>
          <div className="card">
            {transactions && transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
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
                Aucune transaction
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dépôt */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full animate-slide-in">
            <h3 className="text-2xl font-bold mb-4">Effectuer un dépôt</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Montant (€)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                  placeholder="100.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDepositModal(false);
                    setAmount('');
                  }}
                  className="btn-secondary flex-1"
                  disabled={transactionLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleTransaction('DEPOSIT')}
                  className="btn-primary flex-1 disabled:opacity-50"
                  disabled={transactionLoading}
                >
                  {transactionLoading ? 'En cours...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Retrait */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full animate-slide-in">
            <h3 className="text-2xl font-bold mb-4">Effectuer un retrait</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Montant (€)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                  placeholder="100.00"
                  min="0"
                  step="0.01"
                  max={account.balance}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Solde disponible: {account.balance.toLocaleString('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  })}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setAmount('');
                  }}
                  className="btn-secondary flex-1"
                  disabled={transactionLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleTransaction('WITHDRAWAL')}
                  className="btn-primary flex-1 disabled:opacity-50"
                  disabled={transactionLoading}
                >
                  {transactionLoading ? 'En cours...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}