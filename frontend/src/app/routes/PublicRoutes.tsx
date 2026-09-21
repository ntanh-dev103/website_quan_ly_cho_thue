import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';

const HomePage = React.lazy(() => import('@/pages/public/HomePage').then(module => ({ default: module.HomePage })));
const AuthPage = React.lazy(() => import('@/pages/auth/AuthPage').then(module => ({ default: module.AuthPage })));
const CatalogPage = React.lazy(() => import('@/pages/public/CatalogPage').then(module => ({ default: module.CatalogPage })));
const ProductDetailPage = React.lazy(() => import('@/pages/public/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })));

export function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Route>
    </Routes>
  );
}
