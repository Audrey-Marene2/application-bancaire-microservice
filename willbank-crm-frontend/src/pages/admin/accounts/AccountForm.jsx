import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { accountService } from '../../../services/accountService';
import { customerService } from '../../../services/customerService';
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CreditCard,
  User,
  Search
} from 'lucide-react';

export default function AccountForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCustomerId = searchParams.get('customerId');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    customerId: preselectedCustomerId || '',
    type: 'CURRENT',
    initialBalance: 0
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      // Filter only active customers
      setCustomers(data.filter((c) => c.status === 'ACTIVE'));
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Veuillez sélectionner un client';
    }
    if (!formData.type) {
      newErrors.type = 'Veuillez sélectionner un type de compte';
    }
    if (formData.initialBalance < 0) {
      newErrors.initialBalance = 'Le solde initial ne peut pas être négatif';
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

      await accountService.create({
        customerId: formData.customerId,
        type: formData.type,
        balance: formData.initialBalance
      });

      navigate('/admin/accounts');
    } catch (err) {
      console.error('Error creating account:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création du compte');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'initialBalance' ? parseFloat(value) || 0 : value 
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      customer.firstName?.toLowerCase().includes(search) ||
      customer.lastName?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search)
    );
  });

  const selectedCustomer = customers.find((c) => c.id === formData.customerId);

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
            onClick={() => navigate('/admin/accounts')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Nouveau Compte
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Créez un nouveau compte bancaire
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Customer Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Sélection du client
            </h3>
            
            {selectedCustomer ? (
              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        {selectedCustomer.firstName?.charAt(0)}{selectedCustomer.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                      <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, customerId: '' }))}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Changer
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, customerId: customer.id }));
                          setSearchTerm('');
                        }}
                        className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                          <p className="text-xs text-gray-500">{customer.email}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="p-4 text-center text-gray-500">Aucun client trouvé</p>
                  )}
                </div>
                
                {errors.customerId && (
                  <p className="text-red-500 text-sm">{errors.customerId}</p>
                )}
              </div>
            )}
          </div>

          {/* Account Type */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
              Type de compte
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'CURRENT' }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === 'CURRENT'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <CreditCard className={`w-8 h-8 mx-auto mb-2 ${
                  formData.type === 'CURRENT' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <p className="font-semibold">Compte Courant</p>
                <p className="text-xs text-gray-500 mt-1">Pour les opérations quotidiennes</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'SAVINGS' }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.type === 'SAVINGS'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <CreditCard className={`w-8 h-8 mx-auto mb-2 ${
                  formData.type === 'SAVINGS' ? 'text-green-600' : 'text-gray-400'
                }`} />
                <p className="font-semibold">Compte Épargne</p>
                <p className="text-xs text-gray-500 mt-1">Pour faire fructifier votre argent</p>
              </button>
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm mt-2">{errors.type}</p>
            )}
          </div>

          {/* Initial Balance */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Solde initial (€)
            </label>
            <input
              type="number"
              name="initialBalance"
              value={formData.initialBalance}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.initialBalance
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
              } bg-white dark:bg-gray-700 focus:ring-2 focus:border-transparent transition-all`}
              placeholder="0.00"
            />
            {errors.initialBalance && (
              <p className="text-red-500 text-sm mt-1">{errors.initialBalance}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Montant optionnel pour le dépôt initial
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/admin/accounts')}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{saving ? 'Création...' : 'Créer le compte'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
