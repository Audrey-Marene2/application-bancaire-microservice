import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import { customerService } from '../../../services/customerService';
import { accountService } from '../../../services/accountService';
import {
  ArrowLeft,
  Edit,
  Ban,
  CheckCircle,
  Trash2,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Plus,
  Eye
} from 'lucide-react';

export default function CustomerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [customerData, accountsData] = await Promise.all([
        customerService.getById(id),
        accountService.getByCustomerId(id).catch(() => [])
      ]);
      
      setCustomer(customerData);
      setAccounts(accountsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    try {
      setActionLoading(true);
      await customerService.suspend(id);
      await fetchData();
    } catch (err) {
      console.error('Error suspending customer:', err);
      alert('Erreur lors de la suspension');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async () => {
    try {
      setActionLoading(true);
      await customerService.activate(id);
      await fetchData();
    } catch (err) {
      console.error('Error activating customer:', err);
      alert('Erreur lors de l\'activation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await customerService.delete(id);
      navigate('/admin/customers');
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
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

  if (error || !customer) {
    return (
      <AdminLayout>
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error || 'Client non trouvé'}</span>
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
              onClick={() => navigate('/admin/customers')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {customer.firstName} {customer.lastName}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <StatusBadge status={customer.status} />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {customer.id?.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/admin/customers/${id}/edit`)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Modifier</span>
            </button>
            {customer.status === 'ACTIVE' ? (
              <button
                onClick={handleSuspend}
                disabled={actionLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Ban className="w-4 h-4" />
                <span>Suspendre</span>
              </button>
            ) : customer.status === 'SUSPENDED' ? (
              <button
                onClick={handleActivate}
                disabled={actionLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Activer</span>
              </button>
            ) : null}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-primary-600" />
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Prénom</label>
                  <p className="font-medium">{customer.firstName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Nom</label>
                  <p className="font-medium">{customer.lastName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Mail className="w-4 h-4 mr-1" /> Email
                  </label>
                  <p className="font-medium">{customer.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Phone className="w-4 h-4 mr-1" /> Téléphone
                  </label>
                  <p className="font-medium">{customer.phone || 'Non renseigné'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" /> Adresse
                  </label>
                  <p className="font-medium">{customer.address || 'Non renseignée'}</p>
                </div>
              </div>
            </div>

            {/* Accounts Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Comptes bancaires
                </h3>
                <Link
                  to={`/admin/accounts/new?customerId=${id}`}
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau compte</span>
                </Link>
              </div>
              
              {accounts.length > 0 ? (
                <div className="space-y-3">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            Compte {account.type === 'CURRENT' ? 'Courant' : 'Épargne'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            •••• {account.id?.substring(0, 4)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatCurrency(account.balance)}</p>
                          <StatusBadge status={account.status} />
                        </div>
                        <Link
                          to={`/admin/accounts/${account.id}`}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Aucun compte associé
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Statut du compte</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Statut actuel</label>
                  <div className="mt-1">
                    <StatusBadge status={customer.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> Date de création
                  </label>
                  <p className="font-medium">
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Dernière mise à jour</label>
                  <p className="font-medium">
                    {customer.updatedAt
                      ? new Date(customer.updatedAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Résumé</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Nombre de comptes</span>
                  <span className="font-semibold">{accounts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Solde total</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(accounts.reduce((sum, a) => sum + (a.balance || 0), 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Êtes-vous sûr de vouloir supprimer le client{' '}
            <strong>{customer.firstName} {customer.lastName}</strong> ?
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            Cette action est irréversible. Tous les comptes associés seront également affectés.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
              disabled={actionLoading}
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              disabled={actionLoading}
            >
              {actionLoading ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
