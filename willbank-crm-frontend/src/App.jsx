import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Client Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AccountDetail from './pages/AccountDetail';
import Notifications from './pages/Notifications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CustomerList from './pages/admin/customers/CustomerList';
import CustomerForm from './pages/admin/customers/CustomerForm';
import CustomerDetail from './pages/admin/customers/CustomerDetail';
import AccountList from './pages/admin/accounts/AccountList';
import AccountForm from './pages/admin/accounts/AccountForm';
import AdminAccountDetail from './pages/admin/accounts/AccountDetail';
import TransactionList from './pages/admin/transactions/TransactionList';
import TransactionForm from './pages/admin/transactions/TransactionForm';
import NotificationList from './pages/admin/notifications/NotificationList';
import Settings from './pages/admin/settings/Settings';

// Route protégée
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Route publique (redirige vers dashboard si déjà connecté)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/admin" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Routes client (legacy) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/:accountId"
        element={
          <ProtectedRoute>
            <AccountDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* Routes Admin CRM */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Customers */}
      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute>
            <CustomerList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/customers/new"
        element={
          <ProtectedRoute>
            <CustomerForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/customers/:id"
        element={
          <ProtectedRoute>
            <CustomerDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/customers/:id/edit"
        element={
          <ProtectedRoute>
            <CustomerForm />
          </ProtectedRoute>
        }
      />

      {/* Accounts */}
      <Route
        path="/admin/accounts"
        element={
          <ProtectedRoute>
            <AccountList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/accounts/new"
        element={
          <ProtectedRoute>
            <AccountForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/accounts/:id"
        element={
          <ProtectedRoute>
            <AdminAccountDetail />
          </ProtectedRoute>
        }
      />

      {/* Transactions */}
      <Route
        path="/admin/transactions"
        element={
          <ProtectedRoute>
            <TransactionList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transactions/new"
        element={
          <ProtectedRoute>
            <TransactionForm />
          </ProtectedRoute>
        }
      />

      {/* Notifications */}
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute>
            <NotificationList />
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Redirection par défaut */}
      <Route path="/" element={<Navigate to="/admin" />} />
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
