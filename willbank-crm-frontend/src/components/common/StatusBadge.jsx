const statusStyles = {
  // Customer statuses
  ACTIVE: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  PENDING_KYC: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  SUSPENDED: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  CLOSED: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  
  // Account statuses
  FROZEN: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  BLOCKED: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  
  // Transaction statuses
  SUCCESS: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  
  // Notification statuses
  SENT: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  
  // Default
  DEFAULT: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
};

const statusLabels = {
  ACTIVE: 'Actif',
  PENDING_KYC: 'KYC en attente',
  SUSPENDED: 'Suspendu',
  CLOSED: 'Fermé',
  FROZEN: 'Gelé',
  BLOCKED: 'Bloqué',
  SUCCESS: 'Succès',
  FAILED: 'Échoué',
  PENDING: 'En attente',
  SENT: 'Envoyé'
};

export default function StatusBadge({ status, customLabel }) {
  const style = statusStyles[status] || statusStyles.DEFAULT;
  const label = customLabel || statusLabels[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}
