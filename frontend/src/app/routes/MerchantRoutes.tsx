import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MerchantLayout } from '../layouts/MerchantLayout';
import { ProtectedRoute } from '../layouts/ProtectedRoute';

const MerchantDashboard = React.lazy(() => import('@/pages/merchant/MerchantDashboard').then(module => ({ default: module.MerchantDashboard })));
const MerchantInventory = React.lazy(() => import('@/pages/merchant/MerchantInventory').then(module => ({ default: module.MerchantInventory })));
const MerchantContracts = React.lazy(() => import('@/pages/merchant/MerchantContracts').then(module => ({ default: module.MerchantContracts })));

export function MerchantRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRole="MERCHANT"><MerchantLayout /></ProtectedRoute>}>
        <Route path="/merchant" element={<MerchantDashboard />} />
        <Route path="/merchant/inventory" element={<MerchantInventory />} />
        <Route path="/merchant/contracts" element={<MerchantContracts />} />
      </Route>
    </Routes>
  );
}
