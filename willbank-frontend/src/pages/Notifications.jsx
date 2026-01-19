import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import { 
  Bell, 
  Mail,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function Notifications() {
  const { username } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Récupérer le client
      const clientsResponse = await api.get('/client-service/clients');
      const currentClient = clientsResponse.data.find(
        (c) => c.email === `${username}@willbank.com` || c.firstName.toLowerCase() === username.toLowerCase()
      );

      if (!currentClient) {
        setError('Client introuvable');
        return;
      }

      setCustomerId(currentClient.id);

      // 2. Récupérer les notifications
      const notificationsResponse = await api.get(`/notification-service/notifications/customer/${currentClient.id}`);
      setNotifications(notificationsResponse.data);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
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

  return (
    <Layout>
      <div className="space-y-6 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <Bell className="w-8 h-8" />
              <span>Notifications</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {notifications.length} notification{notifications.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Liste des notifications */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={notification.id}
                className="card hover:shadow-xl transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  {/* Icône */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.status === 'SENT'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {notification.channel === 'EMAIL' ? (
                      <Mail className={`w-6 h-6 ${
                        notification.status === 'SENT'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`} />
                    ) : (
                      <Bell className={`w-6 h-6 ${
                        notification.status === 'SENT'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`} />
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-lg">
                        {notification.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center space-x-1 ${
                        notification.status === 'SENT'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {notification.status=== 'SENT' ? (<><CheckCircle className="w-3 h-3" /><span>ENVOYÉ</span></>) : (<>
                            <XCircle className="w-3 h-3" />
                            <span>ÉCHEC</span>
                            </>
                            )}
                            </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                                {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                {new Date(notification.createdAt).toLocaleString('fr-FR')}
                                </span>
                            </div>
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                                {notification.channel}
                            </span>
                            </div>
                        </div>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="card text-center py-12">
                    <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Aucune notification
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 mt-2">
                        Vos notifications apparaîtront ici
                    </p>
                    </div>
                )}
                </div>
            </div>
            </Layout>
            );
}