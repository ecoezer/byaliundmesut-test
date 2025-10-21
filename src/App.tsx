import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import SettingsPage from './pages/SettingsPage';
import MonitorLogin from './pages/MonitorLogin';
import OrderMonitor from './pages/OrderMonitor';
import { ErrorBoundary } from './components/ErrorBoundary';
import { checkAdminAuth } from './lib/adminAuth';
import { monitorAuth } from './lib/monitorAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = checkAdminAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />;
};

const MonitorProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = monitorAuth.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/monitor-login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/monitor-login" element={<MonitorLogin />} />
        <Route
          path="/monitor"
          element={
            <ErrorBoundary fallbackMessage="Failed to load Order Monitor. Check Firebase configuration.">
              <MonitorProtectedRoute>
                <OrderMonitor />
              </MonitorProtectedRoute>
            </ErrorBoundary>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
