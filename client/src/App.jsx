import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';

import StaffManagement from './pages/StaffManagement';
import Laptops from './pages/Laptops';
import Transactions from './pages/Transactions';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="laptops" element={<Laptops />} />
              <Route path="transactions" element={<Transactions />} />
              
              {/* LIBRARIAN ONLY ROUTES nested inside DashboardLayout */}
              <Route element={<ProtectedRoute allowedRoles={['LIBRARIAN']} />}>
                <Route path="reports" element={<div>Reports Module (WIP)</div>} />
                <Route path="staff" element={<StaffManagement />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<div className="h-screen w-full flex items-center justify-center font-bold text-2xl">404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
