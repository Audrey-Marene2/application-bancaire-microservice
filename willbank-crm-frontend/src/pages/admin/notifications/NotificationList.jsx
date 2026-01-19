import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';
import { notificationService } from '../../../services/notificationService';
import { customerService } from '../../../services/customerService';
import {
  Bell,
  Mail,
  Smartphone,
  AlertCircle,
  Filter,
  Send,
  User,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    channel: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendForm, setSendForm] = useState({
    customerId: '',
    channel: 'EMAIL',
    title: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [notificationsData, customersData] = await Promise.all([
        notificationService.getAll(),
        customerService.getAll()
      ]);
      
      const customersMap = {};
      customersData.forEach((c) => {
        customersMap[c.id] = c;
      });
      
      setNotifications(notificationsData);
      setCustomers(customersMap);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!sendForm.customerId || !sendForm.title || !sendForm.message) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      setSending(true);
      await notificationService.sendTest({
        customerId: sendForm.customerId,
        channel: sendForm.channel,
        title: sendForm.title,
        message: sendForm.message
      });
      
      setSendSuccess('Notification envoyée avec succès !');
      setSendForm({
        customerId: '',
        channel: 'EMAIL',
        title: '',
        message: ''
      });
      
      setTimeout(() => {
        setShowSendModal(false);
        setSendSuccess('');
        fetchData();
      }, 2000);
    } catch (err) {
      console.error('Error sending notification:', err);
      alert(err.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  // Apply filters
  const filteredNotifications = notifications.filter((n) => {
    if (filters.channel && n.channel !== filters.channel) return false;
    if (filters.status && n.status !== filters.status) return false;
    return true;
  });

  // Calculate stats
  const stats = {
    total: notifications.length,
    sent: notifications.filter((n) => n.status === 'SENT').length,
    failed: notifications.filter((n) => n.status === 'FAILED').length,
    email: notifications.filter((n) => n.channel === 'EMAIL').length,
    push: notifications.filter((n) => n.channel === 'PUSH').length
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
      label: 'Destinataire',
      render: (value) => {
        const customer = customers[value];
        return customer ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
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
      key: 'channel',
      label: 'Canal',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {value === 'EMAIL' ? (
            <Mail className="w-4 h-4 text-blue-500" />
          ) : (
            <Smartphone className="w-4 h-4 text-green-500" />
          )}
          <span>{value === 'EMAIL' ? 'Email' : 'Push'}</span>
        </div>
      )
    },
    {
      key: 'title',
      label: 'Titre',
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'message',
      label: 'Message',
      render: (value) => (
        <span className="text-sm text-gray-500 truncate max-w-xs block">
          {value?.substring(0, 50)}{value?.length > 50 ? '...' : ''}
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
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{value ? new Date(value).toLocaleString('fr-FR') : 'N/A'}</span>
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
              Gestion des Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredNotifications.length} notification{filteredNotifications.length > 1 ? 's' : ''}
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
              onClick={() => setShowSendModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
              <span>Envoyer</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Canal</label>
                <select
                  value={filters.channel}
                  onChange={(e) => setFilters((prev) => ({ ...prev, channel: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="">Tous</option>
                  <option value="EMAIL">Email</option>
                  <option value="PUSH">Push</option>
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
                  <option value="SENT">Envoyé</option>
                  <option value="FAILED">Échoué</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setFilters({ channel: '', status: '' })}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Envoyées</p>
                <p className="text-xl font-bold text-green-600">{stats.sent}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Échouées</p>
                <p className="text-xl font-bold text-red-600">{stats.failed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Emails</p>
                <p className="text-xl font-bold text-blue-600">{stats.email}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Push</p>
                <p className="text-xl font-bold text-purple-600">{stats.push}</p>
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
          data={filteredNotifications}
          loading={loading}
          searchable
          exportable
          onRefresh={fetchData}
          emptyMessage="Aucune notification trouvée"
        />
      </div>

      {/* Send Notification Modal */}
      <Modal
        isOpen={showSendModal}
        onClose={() => {
          setShowSendModal(false);
          setSendForm({
            customerId: '',
            channel: 'EMAIL',
            title: '',
            message: ''
          });
          setSendSuccess('');
        }}
        title="Envoyer une notification"
        size="md"
      >
        <div className="space-y-4">
          {sendSuccess ? (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>{sendSuccess}</span>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Destinataire</label>
                <select
                  value={sendForm.customerId}
                  onChange={(e) => setSendForm((prev) => ({ ...prev, customerId: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="">Sélectionner un client</option>
                  {Object.values(customers).map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Canal</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSendForm((prev) => ({ ...prev, channel: 'EMAIL' }))}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                      sendForm.channel === 'EMAIL'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Mail className={`w-5 h-5 ${sendForm.channel === 'EMAIL' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span>Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendForm((prev) => ({ ...prev, channel: 'PUSH' }))}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                      sendForm.channel === 'PUSH'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Smartphone className={`w-5 h-5 ${sendForm.channel === 'PUSH' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span>Push</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Titre</label>
                <input
                  type="text"
                  value={sendForm.title}
                  onChange={(e) => setSendForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="Titre de la notification"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={sendForm.message}
                  onChange={(e) => setSendForm((prev) => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="Contenu du message..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowSendModal(false);
                    setSendForm({
                      customerId: '',
                      channel: 'EMAIL',
                      title: '',
                      message: ''
                    });
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  disabled={sending}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendNotification}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  disabled={sending}
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'Envoi...' : 'Envoyer'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </AdminLayout>
  );
}
