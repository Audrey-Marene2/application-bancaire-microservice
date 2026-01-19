import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { transactionService } from '../../../services/transactionService';
import { accountService } from '../../../services/accountService';
import { customerService } from '../../../services/customerService';
import {
  ArrowLeft,
  Send,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  CreditCard,
  Search
} from 'lucide-react';

export default function TransactionForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    type: 'DEPOSIT',
    sourceAccountId: '',
    targetAccountId: '',
    amount: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accountsData, customersData] = await Promise.all([
        accountService.getAll(),
        customerService.getAll()
      ]);
      
      // Filter only active accounts
      setAccounts(accountsData.filter((a) => a.status === 'ACTIVE'));
      
      const customersMap = {};
      customersData.forEach((c) => {
        customersMap[c.id] = c;
      });
      setCustomers(customersMap);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.sourceAccountId) {
      newErrors.sourceAccountId = 'Veuillez sélectionner un compte';
    }
    
    if (formData.type === 'TRANSFER' && !formData.targetAccountId) {
      newErrors.targetAccountId = 'Veuillez sélectionner un compte destinataire';
    }
    
    if (formData.type === 'TRANSFER' && formData.sourceAccountId === formData.targetAccountId) {
      newErrors.targetAccountId = 'Le compte source et destinataire doivent être différents';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Veuillez entrer un montant valide';
    }
    
    // Check balance for withdrawal and transfer
    if (formData.type !== 'DEPOSIT' && formData.sourceAccountId) {
      const sourceAccount = accounts.find((a) => a.id === formData.sourceAccountId);
      if (sourceAccount && parseFloat(formData.amount) > sourceAccount.balance) {
        newErrors.amount = 'Solde insuffisant';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const amount = parseFloat(formData.amount);

      switch (formData.type) {
        case 'DEPOSIT':
          await transactionService.deposit(formData.sourceAccountId, amount);
          break;
        case 'WITHDRAWAL':
          await transactionService.withdraw(formData.sourceAccountId, amount);
          break;
        case 'TRANSFER':
          await transactionService.transfer(
            formData.sourceAccountId,
            formData.targetAccountId,
            amount
          );
          break;
        default:
          throw new Error('Type de transaction invalide');
      }

      setSuccess('Transaction effectuée avec succès !');
      
      // Reset form
      setFormData({
        type: 'DEPOSIT',
        sourceAccountId: '',
        targetAccountId: '',
        amount: ''
      });
      
      // Refresh accounts to get updated balances
      await fetchData();
      
      // Navigate after delay
      setTimeout(() => {
        navigate('/admin/transactions');
      }, 2000);
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(err.response?.data?.message || 'Erreur lors de la transaction');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const filteredAccounts = accounts.filter((account) => {
    if (!searchTerm) return true;
    const customer = customers[account.customerId];
    const search = searchTerm.toLowerCase();
    return (
      account.id?.toLowerCase().includes(search) ||
      customer?.firstName?.toLowerCase().includes(search) ||
      customer?.lastName?.toLowerCase().includes(search) ||
      customer?.email?.toLowerCase().includes(search)
    );
  });

  const selectedSourceAccount = accounts.find((a) => a.id === formData.sourceAccountId);
  const selectedTargetAccount = accounts.find((a) => a.id === formData.targetAccountId);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/transactions')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Nouvelle Transaction
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Effectuez une opération bancaire
            </p>
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

        {/* Success */}
        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
              <TrendingUp className="w-5 h-5" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium mb-4">Type de transaction</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'DEPOSIT', targetAccountId: '' }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === 'DEPOSIT'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${
                  formData.type === 'DEPOSIT' ? 'text-green-600' : 'text-gray-400'
                }`} />
                <p className="font-semibold text-sm">Dépôt</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'WITHDRAWAL', targetAccountId: '' }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === 'WITHDRAWAL'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingDown className={`w-8 h-8 mx-auto mb-2 ${
                  formData.type === 'WITHDRAWAL' ? 'text-red-600' : 'text-gray-400'
                }`} />
                <p className="font-semibold text-sm">Retrait</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'TRANSFER' }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === 'TRANSFER'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <ArrowLeftRight className={`w-8 h-8 mx-auto mb-2 ${
                  formData.type === 'TRANSFER' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <p className="font-semibold text-sm">Virement</p>
              </button>
            </div>
          </div>

          {/* Source Account */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {formData.type === 'TRANSFER' ? 'Compte source' : 'Compte'} <span className="text-red-500">*</span>
            </label>
            
            {selectedSourceAccount ? (
              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {selectedSourceAccount.type === 'CURRENT' ? 'Compte Courant' : 'Compte Épargne'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {customers[selectedSourceAccount.customerId]?.firstName}{' '}
                        {customers[selectedSourceAccount.customerId]?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(selectedSourceAccount.balance)}</p>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, sourceAccountId: '' }))}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Changer
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un compte..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                
                <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account) => {
                      const customer = customers[account.customerId];
                      return (
                        <button
                          key={account.id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, sourceAccountId: account.id }));
                            setSearchTerm('');
                          }}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <div className="text-left">
                              <p className="font-medium">
                                {account.type === 'CURRENT' ? 'Courant' : 'Épargne'} •••• {account.id?.substring(0, 4)}
                              </p>
                              {customer && (
                                <p className="text-xs text-gray-500">
                                  {customer.firstName} {customer.lastName}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="font-semibold">{formatCurrency(account.balance)}</span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="p-4 text-center text-gray-500">Aucun compte trouvé</p>
                  )}
                </div>
                
                {errors.sourceAccountId && (
                  <p className="text-red-500 text-sm">{errors.sourceAccountId}</p>
                )}
              </div>
            )}
          </div>

          {/* Target Account (for transfers) */}
          {formData.type === 'TRANSFER' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Compte destinataire <span className="text-red-500">*</span>
              </label>
              
              {selectedTargetAccount ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {selectedTargetAccount.type === 'CURRENT' ? 'Compte Courant' : 'Compte Épargne'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {customers[selectedTargetAccount.customerId]?.firstName}{' '}
                          {customers[selectedTargetAccount.customerId]?.lastName}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, targetAccountId: '' }))}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Changer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  {accounts
                    .filter((a) => a.id !== formData.sourceAccountId)
                    .map((account) => {
                      const customer = customers[account.customerId];
                      return (
                        <button
                          key={account.id}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, targetAccountId: account.id }))}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <div className="text-left">
                              <p className="font-medium">
                                {account.type === 'CURRENT' ? 'Courant' : 'Épargne'} •••• {account.id?.substring(0, 4)}
                              </p>
                              {customer && (
                                <p className="text-xs text-gray-500">
                                  {customer.firstName} {customer.lastName}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="font-semibold">{formatCurrency(account.balance)}</span>
                        </button>
                      );
                    })}
                </div>
              )}
              
              {errors.targetAccountId && (
                <p className="text-red-500 text-sm mt-2">{errors.targetAccountId}</p>
              )}
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Montant (€) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.amount
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
              } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent transition-all text-2xl font-bold text-center`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
            {selectedSourceAccount && formData.type !== 'DEPOSIT' && (
              <p className="text-sm text-gray-500 mt-1 text-center">
                Solde disponible: {formatCurrency(selectedSourceAccount.balance)}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/admin/transactions')}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center space-x-2 px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 ${
                formData.type === 'DEPOSIT'
                  ? 'bg-green-600 hover:bg-green-700'
                  : formData.type === 'WITHDRAWAL'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span>{saving ? 'En cours...' : 'Effectuer la transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
