import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAuth } from '../../../context/AuthContext';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Globe,
  Moon,
  Sun,
  Save,
  Loader2
} from 'lucide-react';

export default function Settings() {
  const { username } = useAuth();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile
    displayName: username || 'Admin',
    email: 'admin@willbank.com',
    language: 'fr',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    securityAlerts: true,
    
    // System
    darkMode: document.documentElement.classList.contains('dark'),
    autoLogout: 30,
    twoFactorAuth: false
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Paramètres enregistrés avec succès !');
  };

  const toggleDarkMode = () => {
    const newValue = !settings.darkMode;
    setSettings((prev) => ({ ...prev, darkMode: newValue }));
    if (newValue) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'system', label: 'Système', icon: Database }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <SettingsIcon className="w-8 h-8 mr-3 text-primary-600" />
            Paramètres
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez les paramètres de votre compte et de l'application
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary-600" />
                    Informations du profil
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom d'affichage</label>
                      <input
                        type="text"
                        value={settings.displayName}
                        onChange={(e) => setSettings((prev) => ({ ...prev, displayName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center">
                      <Globe className="w-4 h-4 mr-1" /> Langue
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-primary-600" />
                    Préférences de notification
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium">Notifications par email</p>
                        <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                      </div>
                      <button
                        onClick={() => setSettings((prev) => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          settings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium">Notifications push</p>
                        <p className="text-sm text-gray-500">Recevoir des notifications push</p>
                      </div>
                      <button
                        onClick={() => setSettings((prev) => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.pushNotifications ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          settings.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium">Alertes de transaction</p>
                        <p className="text-sm text-gray-500">Être notifié des nouvelles transactions</p>
                      </div>
                      <button
                        onClick={() => setSettings((prev) => ({ ...prev, transactionAlerts: !prev.transactionAlerts }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.transactionAlerts ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          settings.transactionAlerts ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium">Alertes de sécurité</p>
                        <p className="text-sm text-gray-500">Être notifié des événements de sécurité</p>
                      </div>
                      <button
                        onClick={() => setSettings((prev) => ({ ...prev, securityAlerts: !prev.securityAlerts }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.securityAlerts ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          settings.securityAlerts ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary-600" />
                    Paramètres de sécurité
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium">Authentification à deux facteurs</p>
                        <p className="text-sm text-gray-500">Ajouter une couche de sécurité supplémentaire</p>
                      </div>
                      <button
                        onClick={() => setSettings((prev) => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.twoFactorAuth ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="font-medium mb-2">Déconnexion automatique</p>
                      <p className="text-sm text-gray-500 mb-3">Durée d'inactivité avant déconnexion</p>
                      <select
                        value={settings.autoLogout}
                        onChange={(e) => setSettings((prev) => ({ ...prev, autoLogout: parseInt(e.target.value) }))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 heure</option>
                        <option value={120}>2 heures</option>
                      </select>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">Changer le mot de passe</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-3">
                        Il est recommandé de changer régulièrement votre mot de passe
                      </p>
                      <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
                        Modifier le mot de passe
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* System Tab */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Database className="w-5 h-5 mr-2 text-primary-600" />
                    Paramètres système
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {settings.darkMode ? (
                          <Moon className="w-5 h-5 text-primary-600" />
                        ) : (
                          <Sun className="w-5 h-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">Mode sombre</p>
                          <p className="text-sm text-gray-500">Activer le thème sombre</p>
                        </div>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.darkMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="font-medium mb-2">Informations système</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Version</span>
                          <span className="font-mono">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">API Gateway</span>
                          <span className="font-mono">http://localhost:8080</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Environnement</span>
                          <span className="font-mono">Development</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
