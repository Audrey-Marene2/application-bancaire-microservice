import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import { accountService } from '../../../services/accountService';
import { customerService } from '../../../services/customerService';
import {
  Plus,
  Eye,
  Lock,
  Unlock,
  Snowflake,
  XCircle,
  AlertCircle,
  CreditCard,
  User
} from 'lucide-react';

export default function AccountList() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [accountsData, customersData] = await Promise.all([
        accountService.getAll(),
        customerService.getAll()
      ]);
      
      // Create a map of customers for quick lookup
      const customersMap = {};
      customersData.forEach((c) => {
        customersMap[c.id] = c;
      });
      
      setAccounts(accountsData);
      setCustomers(customersMap);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedAccount || !actionType) return;
    
    try {
      setActionLoading(true);
      
      switch (actionType) {
        case 'freeze':
          await accountService.freeze(selectedAccount.id);
          break;
        case 'block':
          await accountService.block(selectedAccount.id);
          break;
        case 'activate':
          await accountService.activate(selectedAccount.id);
          break;
        case 'close':
          await accountService.close(selectedAccount.id);
          break;
        default:
          break;
      }
      
      setShowActionModal(false);
      setSelectedAccount(null);
      setActionType('');
      await fetchData();
    } catch (err) {
      console.error('Error performing action:', err);
      alert(err.response?.data?.message || 'Erreur lors de l\'opération');
    } finally {
      setActionLoading(false);
    }
  };

  const openActionModal = (account, type) => {
    setSelectedAccount(account);
    setActionType(type);
    setShowActionModal(true);
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

  const getActionMessage = () => {
    switch (actionType) {
      case 'freeze':
        return 'Le compte sera gelé temporairement. Les transactions seront suspendues.';
      case 'block':
        return 'Le compte sera bloqué. Aucune opération ne sera possible.';
      case 'activate':
        return 'Le compte sera réactivé et les opérations seront à nouveau possibles.';
      case 'close':
        return 'Le compte sera fermé définitivement. Cette action est irréversible.';
      default:
        return '';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
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
      key: 'customerId',
      label: 'Client',
      render: (value) => {
        const customer = customers[value];
        return customer ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="font-medium">{customer.firstName} {customer.lastName}</p>
              <p className="text-xs text-gray-500">{customer.email}</p>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Client inconnu</span>
        );
      }
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <CreditCard className={`w-4 h-4 ${value === 'CURRENT' ? 'text-blue-500' : 'text-green-500'}`} />
          <span>{value === 'CURRENT' ? 'Courant' : 'Épargne'}</span>
        </div>
      )
    },
    {
      key: 'balance',
      label: 'Solde',
      render: (value) => (
        <span className={`font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(value)}
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
      label: 'Création',
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value ? new Date(value).toLocaleDateString('fr-FR') : 'N/A'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/accounts/${row.id}`);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Voir"
          >
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          {row.status === 'ACTIVE' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openActionModal(row, 'freeze');
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Geler"
              >
                <Snowflake className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openActionModal(row, 'block');
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Bloquer"
              >
                <Lock className="w-4 h-4 text-orange-600" />
              </button>
            </>
          )}
          
          {(row.status === 'FROZEN' || row.status === 'BLOCKED') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openActionModal(row, 'activate');
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Activer"
            >
              <Unlock className="w-4 h-4 text-green-600" />
            </button>
          )}
          
          {row.status !== 'CLOSED' && row.balance === 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openActionModal(row, 'close');
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Fermer"
            >
              <XCircle className="w-4 h-4 text-red-600" />
            </button>
          )}
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
              Gestion des Comptes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {accounts.length} compte{accounts.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/accounts/new')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau Compte</span>
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
          data={accounts}
          loading={loading}
          searchable
          exportable
          onRefresh={fetchData}
          onRowClick={(row) => navigate(`/admin/accounts/${row.id}`)}
          emptyMessage="Aucun compte trouvé"
        />
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => {
          setShowActionModal(false);
          setSelectedAccount(null);
          setActionType('');
        }}
        title={getActionTitle()}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {getActionMessage()}
          </p>
          {selectedAccount && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Compte concerné:</p>
              <p className="font-semibold">
                {selectedAccount.type === 'CURRENT' ? 'Compte Courant' : 'Compte Épargne'}
              </p>
              <p className="text-sm">Solde: {formatCurrency(selectedAccount.balance)}</p>
            </div>
          )}
          {actionType === 'close' && selectedAccount?.balance !== 0 && (
            <p className="text-sm text-red-600 dark:text-red-400">
              ⚠️ Le compte doit avoir un solde nul pour être fermé.
            </p>
          )}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowActionModal(false);
                setSelectedAccount(null);
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
              disabled={actionLoading || (actionType === 'close' && selectedAccount?.balance !== 0)}
            >
              {actionLoading ? 'En cours...' : 'Confirmer'}
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
