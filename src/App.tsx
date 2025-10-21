import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import MonitorLogin from './pages/MonitorLogin';
import OrderMonitor from './pages/OrderMonitor';
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
        <Route path="/monitor-login" element={<MonitorLogin />} />
        <Route
          path="/monitor"
          element={
            <MonitorProtectedRoute>
              <OrderMonitor />
            </MonitorProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
