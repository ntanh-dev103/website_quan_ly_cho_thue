import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../layouts/ProtectedRoute';

const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminApproval = React.lazy(() => import('@/pages/admin/AdminApproval').then(module => ({ default: module.AdminApproval })));
const AdminCategories = React.lazy(() => import('@/pages/admin/AdminCategories').then(module => ({ default: module.AdminCategories })));
const AdminTiers = React.lazy(() => import('@/pages/admin/AdminTiers').then(module => ({ default: module.AdminTiers })));

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/merchants" element={<AdminApproval />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/tiers" element={<AdminTiers />} />
      </Route>
    </Routes>
  );
}
