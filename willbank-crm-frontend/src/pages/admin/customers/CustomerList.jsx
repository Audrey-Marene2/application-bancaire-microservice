import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import { customerService } from '../../../services/customerService';
import {
  UserPlus,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Trash2,
  AlertCircle,
  Mail,
  Phone
} from 'lucide-react';

export default function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (customer) => {
    try {
      setActionLoading(true);
      await customerService.suspend(customer.id);
      await fetchCustomers();
    } catch (err) {
      console.error('Error suspending customer:', err);
      alert('Erreur lors de la suspension du client');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async (customer) => {
    try {
      setActionLoading(true);
      await customerService.activate(customer.id);
      await fetchCustomers();
    } catch (err) {
      console.error('Error activating customer:', err);
      alert('Erreur lors de l\'activation du client');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    try {
      setActionLoading(true);
      await customerService.delete(selectedCustomer.id);
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      await fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Erreur lors de la suppression du client');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => (
        <span className="font-mono text-xs">{value?.substring(0, 8)}...</span>
      )
    },
    {
      key: 'firstName',
      label: 'Nom',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              {row.firstName?.charAt(0)}{row.lastName?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-semibold">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Contact',
      render: (value, row) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-sm">
            <Mail className="w-3 h-3 text-gray-400" />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <Phone className="w-3 h-3 text-gray-400" />
            <span>{row.phone || 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'createdAt',
      label: 'Date création',
      render: (value) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {value ? new Date(value).toLocaleDateString('fr-FR') : 'N/A'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/customers/${row.id}`);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Voir"
          >
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/customers/${row.id}/edit`);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Modifier"
          >
            <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
          {row.status === 'ACTIVE' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSuspend(row);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Suspendre"
              disabled={actionLoading}
            >
              <Ban className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </button>
          ) : row.status === 'SUSPENDED' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleActivate(row);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Activer"
              disabled={actionLoading}
            >
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </button>
          ) : null}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCustomer(row);
              setShowDeleteModal(true);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
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
              Gestion des Clients
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {customers.length} client{customers.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/customers/new')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>Nouveau Client</span>
          </button>
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
          data={customers}
          loading={loading}
          searchable
          exportable
          onRefresh={fetchCustomers}
          onRowClick={(row) => navigate(`/admin/customers/${row.id}`)}
          emptyMessage="Aucun client trouvé"
        />
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCustomer(null);
        }}
        title="Confirmer la suppression"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Êtes-vous sûr de vouloir supprimer le client{' '}
            <strong>{selectedCustomer?.firstName} {selectedCustomer?.lastName}</strong> ?
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            Cette action est irréversible.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedCustomer(null);
              }}
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
